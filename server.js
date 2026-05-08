const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const IMPORTANT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs', '.php', '.cpp', '.c', '.h', '.hpp', '.cs', '.rb'];
const IMPORTANT_FILES = ['requirements.txt'];
const IGNORED_FOLDERS = ['node_modules', 'dist', 'build', '.git', 'coverage', '__pycache__'];
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

function parseRepoUrl(url) {
  const match = url && url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function selectImportantFiles(tree) {
  const filtered = tree.filter(file => {
    if (file.type !== 'blob') return false;
    const p = file.path;
    if (IGNORED_FOLDERS.some(f => p.includes(f))) return false;
    if (IMPORTANT_FILES.some(name => p.endsWith(name))) return true;
    if (IMPORTANT_EXTENSIONS.some(ext => p.endsWith(ext))) return true;
    return false;
  });
  return filtered.slice(0, 10);
}

async function ghGet(url, pat) {
  const headers = { Accept: 'application/vnd.github+json' };
  const token = pat || process.env.GITHUB_PAT;
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await axios.get(url, { headers });
  return res.data;
}

async function generatePrompt(promptBody) {
  const promptText = typeof promptBody === 'string' ? promptBody : (promptBody && promptBody.prompt) || String(promptBody);
  const modelName = (promptBody && promptBody.model) || OLLAMA_MODEL;
  const payload = {
    model: modelName,
    stream: false,
    prompt: promptText
  };
  try {
    const res = await axios.post(`${OLLAMA_URL}/api/generate`, payload, { timeout: 300000 });
    return res.data;
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      throw new Error(`Local model server unreachable at ${OLLAMA_URL}/api/generate`);
    }
    throw err;
  }
}

app.post('/generate', async (req, res) => {
  try {
    const { pat, repoUrl, model } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) return res.status(400).json({ error: 'Invalid GitHub URL' });

    const { owner, repo } = parsed;

    const repoMeta = await ghGet(`https://api.github.com/repos/${owner}/${repo}`, pat);
    const branch = repoMeta.default_branch || 'main';

    const treeResp = await ghGet(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, pat);
    const tree = treeResp.tree || [];

    const important = selectImportantFiles(tree);

    const fileSummaries = [];
    for (const file of important) {
      try {
        const contentResp = await ghGet(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(file.path)}?ref=${branch}`, pat);
        const encoded = contentResp.content || '';
        const decoded = Buffer.from(encoded, 'base64').toString('utf8').slice(0, 1500);

        const prompt = `You are analyzing this GitHub repository: ${owner}/${repo}\nFile path: ${file.path}\nCode:\n${decoded}\nExplain:\n1. What this file does\n2. Technologies/frameworks involved\n3. Important architectural insights\n4. Short concise summary\n`;

        const gen = await generatePrompt({ prompt, model });
        const responseText = (gen && gen.response) || JSON.stringify(gen);

        fileSummaries.push({ path: file.path, summary: responseText });
      } catch (e) {
        fileSummaries.push({ path: file.path, summary: `Error fetching or summarizing: ${e.message}` });
      }
    }

    const combined = fileSummaries.map(f => `FILE: ${f.path}\n\nSUMMARY:\n${f.summary}`).join('\n\n-------------------\n\n');

    const finalPrompt = `You are a senior software engineer and technical writer.\n\nGenerate a professional, polished, production-quality GitHub README.md.\n\nRepository Information:\n- Repository Owner: ${owner}\n- Repository Name: ${repo}\n\nRepository Analysis:\n${combined}\n\nInstructions:\n- Use the EXACT repository name provided above as the project title\n- Do NOT invent repository names\n- Do NOT invent technologies that are not mentioned in the analysis\n- Do NOT fabricate installation steps\n- If installation steps are unclear, provide generic setup instructions and clearly label assumptions\n- Infer the project architecture carefully from the provided analysis\n- Keep the README concise, professional, and developer-friendly\n- Use proper markdown formatting\n- Output ONLY valid markdown\n\nThe README should include sections: Overview, Features, Technologies Used, Architecture, Installation, Usage, Workflow, Project Structure, Conclusion.`;

    const finalGen = await generatePrompt({ prompt: finalPrompt, model });
    const finalText = (finalGen && finalGen.response) || JSON.stringify(finalGen);

    const readme = `# ${repo}\n\n> Repository: https://github.com/${owner}/${repo}\n\n${finalText}`;

    return res.json({ owner, repo, readme });
  } catch (err) {
    const message = err.message || String(err);
    if (message.includes('Local model server unreachable')) {
      return res.status(503).json({
        error: message,
        hint: `Start Ollama with \`ollama serve\` or set OLLAMA_URL to the correct host.`
      });
    }
    return res.status(500).json({ error: message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
