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
    if (html.includes('name="description"')) {
      console.log(`Already has description: ${d}`);
      return;
    }

    let desc = '';
    if (d === 'telegram' || d === 'tg') {
      desc = '正在安全直达节点白皮书官方 Telegram 交流频道与通知群组，若未自动跳转请点击立即前往。';
    } else {
      const h3Match = html.match(/<h3[^>]*>正在直达(.*?)官方.*<\/h3>/);
      let brand = h3Match ? h3Match[1] : d;
      const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      let pText = pMatch ? pMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      pText = pText.replace(/。?如果未自动跳转[：:]?/, '').trim();
      if (pText) {
        desc = `正在安全直达${brand}官方通道，${pText}。若页面未自动跳转请点击前往官网。`;
      } else {
        desc = `正在安全直达${brand}官方通道并激活专属优惠，若页面未自动跳转请点击前往官网。`;
      }
    }

    const metaTag = `  <meta name="description" content="${desc}">\n`;
    if (html.includes('<meta name="robots" content="noindex, nofollow">\r\n')) {
      html = html.replace('<meta name="robots" content="noindex, nofollow">\r\n', '<meta name="robots" content="noindex, nofollow">\r\n' + metaTag);
    } else if (html.includes('<meta name="robots" content="noindex, nofollow">\n')) {
      html = html.replace('<meta name="robots" content="noindex, nofollow">\n', '<meta name="robots" content="noindex, nofollow">\n' + metaTag);
    } else {
      html = html.replace(/<head>\r?\n/, match => match + metaTag);
    }
    fs.writeFileSync(p, html, 'utf8');
    console.log(`Updated ${d} => ${desc}`);
  });
}

// Update 404.html
const p404 = path.join(rootDir, '404.html');
if (fs.existsSync(p404)) {
  let html = fs.readFileSync(p404, 'utf8');
  if (!html.includes('name="description"')) {
    const desc = '节点白皮书学术智库页面路由分发与重定向中心，为您快速检索物理静态文献档案与评测报告。';
    const metaTag = `  <meta name="description" content="${desc}">\n`;
    html = html.replace(/<meta name="robots" content="noindex, follow">\r?\n/, match => match + metaTag);
    fs.writeFileSync(p404, html, 'utf8');
    console.log(`Updated 404.html`);
  }
}

// Update article/index.html
const pArticle = path.join(rootDir, 'article', 'index.html');
if (fs.existsSync(pArticle)) {
  let html = fs.readFileSync(pArticle, 'utf8');
  if (!html.includes('name="description"')) {
    const desc = '节点白皮书学术文献库路由分发中心，为您快速定位全球网络节点性能评测白皮书与技术深度分析。';
    const metaTag = `  <meta name="description" content="${desc}">\n`;
    html = html.replace(/<meta name="robots" content="noindex, follow">\r?\n/, match => match + metaTag);
    fs.writeFileSync(pArticle, html, 'utf8');
    console.log(`Updated article/index.html`);
  }
}
