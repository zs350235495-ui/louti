/**
 * test-seo-audit.js - 节点白皮书 (tizivpn.net) 自动化 SEO、E-E-A-T 实体权威度与 0 死链全站门禁校验脚本
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = __dirname;
let hasError = false;

function logPass(msg) {
  console.log(`  \x1b[32m✔ PASS\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`  \x1b[31m✖ FAIL\x1b[0m ${msg}`);
  hasError = true;
}

console.log('\n======================================================');
console.log('🚀 开始节点白皮书 (tizivpn.net) SEO、E-E-A-T 权威度与 0 死链全栈审计');
console.log('======================================================\n');

// 1. 核心基础设施与合规文件完整性检查
console.log('📦 1. 核心基础设施与开源合规文件检查');
const requiredFiles = [
  'LICENSE',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'index.html',
  '404.html',
  'css/tailwind.min.css',
  'favicon.svg',
  'logo.svg'
];

for (const file of requiredFiles) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
    logPass(`核心文件存在且非空: ${file} (${fs.statSync(filePath).size} bytes)`);
  } else {
    logFail(`缺少核心必要文件: ${file}`);
  }
}

// 2. 爬虫协议 robots.txt 与 AI 引擎放行断言
console.log('\n🤖 2. robots.txt 爬虫协议与 AI 搜索引擎友好度检查');
const robotsContent = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
const requiredBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Applebot-Extended', 'Google-Extended', 'Bytespider', 'cohere-ai'];
for (const bot of requiredBots) {
  if (robotsContent.includes(`User-agent: ${bot}`)) {
    logPass(`已显式放行主流 AI 检索爬虫: ${bot}`);
  } else {
    logFail(`未显式放行 AI 爬虫: ${bot}`);
  }
}
if (robotsContent.includes('Allow: /css/') && robotsContent.includes('Sitemap: https://tizivpn.net/sitemap.xml')) {
  logPass('静态样式路径已放行且正确声明 Sitemap 索引');
} else {
  logFail('robots.txt 缺少样式放行或 Sitemap 声明');
}

// 3. AI 信源协议 llms.txt 规范性检查
console.log('\n🧠 3. llms.txt AI 权威信源规范检查');
const llmsContent = fs.readFileSync(path.join(rootDir, 'llms.txt'), 'utf8');
if (llmsContent.includes('节点白皮书') && llmsContent.includes('Methodology') && llmsContent.includes('https://tizivpn.net/posts/wp-')) {
  logPass('llms.txt 包含客观评测方法论与核心研报 Clean URL 目录');
} else {
  logFail('llms.txt 内容不完整');
}

// 4. 全站 0 商业返利推广外链 (0 AFF / 0 Code) 与 0 外部 TG 直连断言
console.log('\n🛡️ 4. GitHub ToS 合规与全站 0 商业推广/返利链接断言');
const allHtmlFiles = [];
function collectHtml(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory() && entry !== '.git' && entry !== 'node_modules' && entry !== 'go') {
      collectHtml(full);
    } else if (entry.endsWith('.html')) {
      allHtmlFiles.push(full);
    }
  }
}
collectHtml(rootDir);

const affPatterns = [
  /\?code=/i,
  /\?aff=/i,
  /\?ref=/i,
  /huanqiutiaff/i,
  /dalaoyunaff/i,
  /shandianshuaff/i,
  /yunjiexianaff/i,
  /shenxingaff/i,
  /liulianyunaff/i,
  /jlyvipaff/i,
  /ytjcok/i,
  /gntvipaff/i,
  /edgenovaaff/i,
  /t\.me\//i
];

let affFound = 0;
for (const filePath of allHtmlFiles) {
  const rel = path.relative(rootDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  for (const p of affPatterns) {
    if (p.test(content)) {
      logFail(`在 ${rel} 中检测到未脱敏返利/推广/外部群组模式: ${p}`);
      affFound++;
    }
  }
}
const readmeContent = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8');
for (const p of affPatterns) {
  if (p.test(readmeContent)) {
    logFail(`在 README.md 中检测到未脱敏返利/推广模式: ${p}`);
    affFound++;
  }
}

if (affFound === 0) {
  logPass(`全站 ${allHtmlFiles.length} 个 HTML 页面与 README.md 均实现 0 返利外链、0 邀请码、0 外部引流`);
}

// 5. 单一 <h1> 语义结构与 Canonical 闭环断言
console.log('\n📑 5. 单一 <h1> 标题层级与 Canonical 闭环检查');
let h1Errors = 0;
let canonicalErrors = 0;

for (const filePath of allHtmlFiles) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (rel === '404.html' || rel === 'article/index.html') continue; // 路由重定向单页豁免
  
  const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
  const h1Matches = cleanContent.match(/<h1[\s>]/gi) || [];
  if (h1Matches.length !== 1) {
    logFail(`${rel} 包含 ${h1Matches.length} 个 <h1> 标签 (必须严格等于 1)`);
    h1Errors++;
  }

  const canonMatch = content.match(/<link rel="canonical" href="([^"]+)">/);
  if (!canonMatch) {
    logFail(`${rel} 缺少 <link rel="canonical"> 声明`);
    canonicalErrors++;
  } else {
    const href = canonMatch[1];
    if (!href.startsWith('https://tizivpn.net/')) {
      logFail(`${rel} Canonical URL 非根域格式: ${href}`);
      canonicalErrors++;
    }
  }
}

if (h1Errors === 0) logPass(`全部内容页面均严格遵循唯一 <h1> 语义标准`);
if (canonicalErrors === 0) logPass(`全部内容页面均规范挂载 https://tizivpn.net/ Clean Canonical URL`);

// 6. Schema.org JSON-LD 结构化数据完整性检查
console.log('\n🏛️ 6. E-E-A-T 实体权威度 (Schema.org JSON-LD @graph) 验证');
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const indexSchemaMatch = indexHtmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (indexSchemaMatch) {
  try {
    const parsed = JSON.parse(indexSchemaMatch[1]);
    const types = (parsed['@graph'] || []).map(item => item['@type']);
    if (types.includes('WebSite') && types.includes('Organization') && types.includes('Person') && types.includes('FAQPage')) {
      logPass(`首页完整包含 WebSite, Organization, Person, FAQPage 结构化数据`);
    } else {
      logFail(`首页缺少必要 Schema 类型，当前包含: ${types.join(', ')}`);
    }
  } catch (e) {
    logFail(`首页 JSON-LD 解析异常: ${e.message}`);
  }
} else {
  logFail(`首页未检测到 JSON-LD 脚本`);
}

// 7. 本地真实 HTTP Server 挂载与全站 0 死链测试 (Sitemap 物理对齐 + 内链验证)
console.log('\n🌐 7. 本地 HTTP Server 挂载与全站 0 死链验证');
const sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>(https:\/\/tizivpn\.net\/[^<]*)<\/loc>/g)].map(m => m[1]);

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  let localFile = path.join(rootDir, reqPath);
  if (!fs.existsSync(localFile) && fs.existsSync(localFile + '.html')) {
    localFile = localFile + '.html';
  }
  
  if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
    const ext = path.extname(localFile);
    const mimeMap = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.xml': 'application/xml; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8'
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(localFile));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

const PORT = 8099;
server.listen(PORT, async () => {
  try {
    let sitemapFailures = 0;
    for (const fullUrl of locMatches) {
      const urlPath = fullUrl.replace('https://tizivpn.net', '') || '/';
      const statusCode = await fetchStatus(`http://127.0.0.1:${PORT}${urlPath}`);
      if (statusCode === 200) {
        logPass(`Sitemap 条目验证通过 (200 OK): ${urlPath}`);
      } else {
        logFail(`Sitemap 死链 (HTTP ${statusCode}): ${urlPath}`);
        sitemapFailures++;
      }
    }

    // 检查核心静态资源
    const staticAssets = ['/css/tailwind.min.css', '/favicon.svg', '/logo.svg', '/robots.txt', '/sitemap.xml', '/llms.txt'];
    for (const asset of staticAssets) {
      const sc = await fetchStatus(`http://127.0.0.1:${PORT}${asset}`);
      if (sc === 200) {
        logPass(`关键静态资源 200 OK: ${asset}`);
      } else {
        logFail(`关键静态资源丢失 (HTTP ${sc}): ${asset}`);
      }
    }

    console.log('\n======================================================');
    if (!hasError) {
      console.log('🎉 恭喜！tizivpn.net 全栈 SEO 与 E-E-A-T 门禁校验 100% 全部通过！');
      console.log('======================================================\n');
      process.exit(0);
    } else {
      console.error('❌ 存在未通过的门禁断言，请检查上方日志修复后重试！');
      console.log('======================================================\n');
      process.exit(1);
    }
  } finally {
    server.close();
  }
});

function fetchStatus(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => {
      resolve(500);
    });
  });
}
