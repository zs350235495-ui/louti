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
    if (html.includes('<h3')) {
      html = html.replace(/<h3([^>]*)>/g, '<h1$1>').replace(/<\/h3>/g, '</h1>');
      fs.writeFileSync(p, html, 'utf8');
      console.log(`Converted h3 to h1 in: ${d}`);
    }
  });
}
