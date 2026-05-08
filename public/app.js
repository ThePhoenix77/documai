const form = document.getElementById('form');
const result = document.getElementById('result');
const downloadBtn = document.getElementById('download');
const loader = document.getElementById('loader');
const inputs = [
  document.getElementById('repoUrl'),
  document.getElementById('pat'),
  document.getElementById('model'),
  document.getElementById('submit')
];

function setLoading(isLoading) {
  loader.style.display = isLoading ? 'flex' : 'none';
  inputs.forEach(el => {
    if (el) el.disabled = isLoading;
  });
  downloadBtn.disabled = isLoading;
  downloadBtn.textContent = isLoading ? 'Generating...' : 'Download README.md';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.value = '';
  downloadBtn.style.display = 'none';

  const repoUrl = document.getElementById('repoUrl').value.trim();
  const pat = document.getElementById('pat').value.trim();
  const model = document.getElementById('model').value.trim();

  if (!repoUrl) {
    alert('Repository URL is required');
    return;
  }

  setLoading(true);

  try {
    const resp = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl, pat, model })
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || JSON.stringify(data));

    result.value = data.readme || '';
    downloadBtn.style.display = 'inline-block';
    downloadBtn.textContent = 'Download README.md';

    downloadBtn.onclick = () => {
      const blob = new Blob([data.readme || ''], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      a.click();
      URL.revokeObjectURL(url);
    };
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    setLoading(false);
  }
});
