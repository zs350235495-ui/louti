const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const goDir = path.join(rootDir, 'go');

if (fs.existsSync(goDir)) {
  const dirs = fs.readdirSync(goDir);

  dirs.forEach(d => {
    const p = path.join(goDir, d, 'index.html');
    if (!fs.existsSync(p)) return;
    let html = fs.readFileSync(p, 'utf8');
    if (html.includes('http-equiv="refresh"')) {
      html = html.replace(/[ \t]*<meta http-equiv="refresh"[^>]*>\r?\n/g, '');
      fs.writeFileSync(p, html, 'utf8');
      console.log(`Removed meta refresh from: ${d}`);
    }
  });
}
