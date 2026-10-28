/**
 * 节点白皮书 (tizivpn.net) - IndexNow 搜索引擎即时推送工具
 * 协议规范：https://www.indexnow.org/
 * 密钥文件：697b29a162eb4e538f4d0040b2cd8df4.txt
 * 支持引擎：Microsoft Bing, Yandex, Seznam, Naver 等 IndexNow 联盟搜索引擎
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'tizivpn.net';
const KEY_FILE = '697b29a162eb4e538f4d0040b2cd8df4.txt';
const KEY_PATH = path.join(__dirname, KEY_FILE);
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

// 校验与提取 Key
function getApiKey() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(`未找到 IndexNow 密钥文件: ${KEY_FILE}`);
  }
  const key = fs.readFileSync(KEY_PATH, 'utf8').trim();
  if (!key) {
    throw new Error(`IndexNow 密钥文件内容为空: ${KEY_FILE}`);
  }
  return key;
}

// 从 sitemap.xml 提取所有需要推送的绝对物理 URL
function getUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error('未找到 sitemap.xml 文件，无法提取推送 URL');
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
  const urls = matches.map(m => m[1].trim());
  const uniqueUrls = Array.from(new Set(urls));
  
  if (uniqueUrls.length === 0) {
    throw new Error('sitemap.xml 中未匹配到任何有效 <loc> URL');
  }
  return uniqueUrls;
}

function postToIndexNow(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(endpoint);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'NodeReport-IndexNow-Bot/1.0'
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body: body
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`请求超时: ${endpoint}`));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('\n======================================================');
  console.log('🚀 节点白皮书 (tizivpn.net) IndexNow 自动化即时推送');
  
  try {
    const apiKey = getApiKey();
    const urls = getUrlsFromSitemap();
    const keyLocation = `https://${HOST}/${KEY_FILE}`;

    console.log(`📌 目标站点: https://${HOST}`);
    console.log(`🔑 验证密钥: ${apiKey}`);
    console.log(`📄 密钥验证路径: ${keyLocation}`);
    console.log(`📊 准备推送 URL 数量: ${urls.length} 条`);
    console.log('======================================================\n');

    const payload = JSON.stringify({
      host: HOST,
      key: apiKey,
      keyLocation: keyLocation,
      urlList: urls
    }, null, 2);

    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow'
    ];

    let successCount = 0;
    for (const ep of endpoints) {
      console.log(`📡 正在向 [${ep}] 提交推送请求...`);
      try {
        const result = await postToIndexNow(ep, payload);
        if (result.statusCode === 200 || result.statusCode === 202) {
          console.log(`✅ [${new URL(ep).hostname}] 推送成功！HTTP 状态码: ${result.statusCode} (${result.statusMessage || 'OK'})`);
          successCount++;
        } else {
          console.warn(`⚠️ [${new URL(ep).hostname}] 响应状态异常: ${result.statusCode} (${result.statusMessage})\n   详情: ${result.body}`);
        }
      } catch (err) {
        console.error(`❌ [${new URL(ep).hostname}] 请求失败: ${err.message}`);
      }
    }

    console.log('\n------------------------------------------------------');
    if (successCount > 0) {
      console.log('🎉 索引推送完成！已成功广播给主流搜索引擎。');
      console.log('🌐 微软 Bing 及伙伴网络已登记并调度即时抓取更新：');
      urls.slice(0, 8).forEach(u => console.log(`   ➜ ${u}`));
      if (urls.length > 8) {
        console.log(`   ... 以及其他 ${urls.length - 8} 个核心页面与前沿研报。`);
      }
    } else {
      console.error('❌ 所有端点提交均未返回成功状态，请检查网络或密钥配置。');
      process.exit(1);
    }
    console.log('------------------------------------------------------\n');

  } catch (error) {
    console.error(`\n❌ 执行失败: ${error.message}\n`);
    process.exit(1);
  }
}

run();
