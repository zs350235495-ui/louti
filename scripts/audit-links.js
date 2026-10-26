const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = [];

function collectHtml(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory() && entry !== '.git' && entry !== 'node_modules') {
      collectHtml(full);
    } else if (entry.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}

collectHtml(rootDir);

const results = [];

for (const file of htmlFiles) {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  
  // match <a ... href="..." ...>
  const linkRegex = /<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const tag = match[0];
    const href = match[1];
    
    // Check if it's an external link or a /go/ link
    const isGo = href.startsWith('/go/') || href.startsWith('/go.html') || href.startsWith('go/');
    const isHttp = href.startsWith('http://') || href.startsWith('https://');
    
    if (isGo || isHttp) {
      const relMatch = tag.match(/rel=["']([^"']*)["']/i);
      const relVal = relMatch ? relMatch[1] : null;
      results.push({
        file: relPath,
        tag,
        href,
        rel: relVal,
        isGo,
        isHttp
      });
    }
  }
}

console.log('Total outbound / go links found:', results.length);

const groupedByHref = {};
results.forEach(r => {
  groupedByHref[r.href] = (groupedByHref[r.href] || 0) + 1;
});
console.log('Grouped by href:');
console.log(JSON.stringify(groupedByHref, null, 2));

const missingSponsored = results.filter(r => {
  if (r.file.startsWith('go/')) return false; // skip internal go target links
  if (!r.isGo && !r.isHttp) return false;
  // External non-aff links like google, w3c, etc. might not be sponsored, but let's check
  return !r.rel || !r.rel.includes('sponsored');
});

console.log('\nLinks without "sponsored":', missingSponsored.length);
missingSponsored.forEach(m => {
  console.log(`[${m.file}] href: ${m.href} | rel: ${m.rel}`);
});
