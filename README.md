# Documai

An intelligent README generator that analyzes GitHub repositories and creates professional documentation using local AI models. Built with Node.js, Express, and Ollama.

## Overview

Documai is a web-based AI agent that automatically generates high-quality README files for any GitHub repository. Instead of manually writing documentation, simply provide a repository URL, and Documai will:

1. Fetch important source files from the repository
2. Analyze the codebase using a local AI model
3. Generate a professional, well-structured README

The entire process runs locally with zero external AI service dependencies—all analysis happens on your machine using Ollama.

## Features

- **Local-first**: All AI processing happens on your local machine using Ollama
- **Zero external dependencies**: No cloud APIs required
- **GitHub integration**: Automatically fetches repository structure and code
- **Multiple model support**: Works with mistral, llama3.2, deepseek-r1, and other Ollama models
- **Easy to use**: Simple web interface for non-technical users
- **Customizable**: Pass a GitHub PAT for private repository access
- **Download-ready**: Generated READMEs download as markdown files

## Demo


https://github.com/user-attachments/assets/ce9ef812-35ab-409d-a63a-c5bdd1717280

**Note:** The whole documai process may take much longer depending on your machine ressources and chosen model.

## Prerequisites

Before using Documai, ensure you have:

1. **Node.js** (v14 or higher)
2. **npm** (comes with Node.js)
3. **Ollama** installed and running locally
4. A local Ollama model (e.g., `mistral`, `llama3.2`, or `deepseek-r1:14b`)

### Installing Ollama

- Download from [ollama.ai](https://ollama.ai)
- Follow the installation guide for your OS
- Start the Ollama server: `ollama serve`
- Pull a model: `ollama pull mistral` (or your preferred model)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start Ollama

In a separate terminal:

```bash
ollama serve
```

Verify Ollama is running:

```bash
curl http://localhost:11434/api/tags
```

### 3. Start Documai

```bash
npm start
```

The app will start at `http://localhost:3000`.

### 4. Generate a README

1. Open `http://localhost:3000` in your browser
2. Paste a GitHub repository URL (e.g., `https://github.com/owner/repo`)
3. (Optional) Add your GitHub PAT if accessing a private repository
4. Select a local model (default: `mistral`)
5. Click **Generate README**
6. Wait for analysis and generation (typically 30-60 seconds)
7. Download the generated README

## Usage

### Environment Variables

You can configure Documai using environment variables in a `.env` file:

```bash
# GitHub Personal Access Token (optional, for private repos)
GITHUB_PAT=your_github_pat_here

# Ollama server URL (default: http://127.0.0.1:11434)
OLLAMA_URL=http://127.0.0.1:11434

# Default model (default: mistral)
OLLAMA_MODEL=mistral

# Express server port (default: 3000)
PORT=3000
```

### API Endpoint

You can also call the generation endpoint directly:

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/owner/repo",
    "pat": "your_github_pat",
    "model": "mistral"
  }'
```

Response:

```json
{
  "owner": "owner",
  "repo": "repo",
  "readme": "# repo\n\n> Repository: https://github.com/owner/repo\n\n..."
}
```

## Project Structure

```
documai/
├── server.js                 # Express backend and core logic
├── public/
│   ├── index.html           # Web UI (forms, inputs, display)
│   └── app.js               # Client-side JavaScript (form handlers)
├── package.json             # Node.js dependencies
├── .env                     # Environment configuration (local only)
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── LICENSE                 # License information
└── generate-readme.json    # (Legacy) n8n workflow export
```

### Key Files

- **`server.js`**: REST API server that orchestrates GitHub API calls and Ollama model inference
- **`public/index.html`**: Web interface with form inputs and README display
- **`public/app.js`**: Client-side event handling and API communication
- **`.env`**: Local environment configuration (GitHub token, Ollama URL/model)

## Architecture

### High-Level Flow

```
User Input
    ↓
[Browser] → GET/POST requests → [Express Server]
                                    ↓
                            Parse Repository URL
                                    ↓
                            GitHub API: Fetch repo metadata
                                    ↓
                            GitHub API: Fetch file tree
                                    ↓
                            Select important files (.js, .ts, .py, etc.)
                                    ↓
                            For each file:
                                - Fetch file content
                                - Analyze with Ollama model
                                - Extract insights
                                    ↓
                            Combine all insights
                                    ↓
                            Generate final README with Ollama
                                    ↓
                            Return README to client
                                    ↓
                            [Browser] Display & Download
```

### Component Breakdown

**Frontend (Browser)**
- Static HTML with form inputs
- JavaScript for form submission and file download
- Loading indicator for generation progress
- Textarea for displaying generated README

**Backend (Express)**
- `/generate` POST endpoint for README generation
- GitHub API integration to fetch repository data
- File filtering logic to select important source files
- Ollama integration for AI analysis and README generation
- Error handling and helpful error messages

**External Services**
- **GitHub API**: Repository metadata, file tree, file content retrieval
- **Ollama API**: Local AI model inference for analysis and generation

## Workflow

### Step-by-Step Generation Process

1. **Parse Repository URL**
   - Extract owner and repo name from GitHub URL

2. **Fetch Repository Metadata**
   - Call GitHub API to get default branch, owner info

3. **Fetch File Tree**
   - Retrieve recursive file tree of the repository

4. **Filter Important Files**
   - Select up to 10 important files based on extensions:
     - Code: `.js`, `.ts`, `.jsx`, `.tsx`, `.py`, `.java`, `.go`, `.rs`, `.php`, `.cpp`, `.c`, `.h`, `.hpp`, `.cs`, `.rb`
     - Config: `requirements.txt`
   - Exclude folders: `node_modules`, `dist`, `build`, `.git`, `coverage`, `__pycache__`

5. **Analyze Each File**
   - Fetch file content from GitHub
   - Send to Ollama for analysis:
     - What the file does
     - Technologies and frameworks
     - Architectural insights
     - Concise summary
   - Store summaries

6. **Generate Final README**
   - Combine all file summaries
   - Send comprehensive prompt to Ollama:
     - Repository name and owner
     - File analysis summaries
     - Instructions for professional README structure
   - Ollama generates sections:
     - Overview
     - Features
     - Technologies Used
     - Architecture
     - Installation
     - Usage
     - Workflow
     - Project Structure
     - Conclusion

7. **Return to User**
   - Display generated README in textarea
   - Provide download button

### Error Handling

- **Missing repo URL**: Returns 400 error
- **Invalid GitHub URL**: Returns 400 error
- **Ollama unreachable**: Returns 503 with helpful message
- **GitHub API rate limits**: Handled by providing clear error messages
- **File fetch errors**: Skipped individually; generation continues

## Tested Models

This project was built and tested with:

- **mistral** (default) - Fast, reliable, good balance of quality and speed
- **llama3.2** - Lighter model, faster inference
- **deepseek-r1:14b** - Larger model, more detailed analysis

Other Ollama models should work, but may require different timeout configurations for larger or slower models.

## Dependencies

- **express**: Web framework for Node.js
- **axios**: HTTP client for API calls
- **dotenv**: Environment variable management

## Troubleshooting

### "Local model server unreachable"

**Cause**: Ollama is not running or not accessible at `http://127.0.0.1:11434`

**Solution**:
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Verify it's running
curl http://localhost:11434/api/tags
```

### "Invalid GitHub URL"

**Cause**: Repository URL is not in the format `https://github.com/owner/repo`

**Solution**: Ensure the URL follows the GitHub format

### "GitHub API rate limit exceeded"

**Cause**: Too many requests without authentication

**Solution**: Provide a GitHub PAT in the `.env` file or UI field

### "Generation takes too long or times out"

**Cause**: Model is too large or system is slow

**Solution**:
- Use a faster model (e.g., `llama3.2` instead of `deepseek-r1:14b`)
- Reduce repository file count by using `.gitignore`
- Increase timeout in Express (modify `server.js`)

## License

See [LICENSE](LICENSE) for details.

## Coming Improvements

- Integration with GitHub to auto-commit READMEs
- Code snippet extraction and syntax highlighting
- Progress indicator for file analysis
- README template customization
