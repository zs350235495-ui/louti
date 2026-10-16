# 节点白皮书 (Node Report & Research)

> 全球节点拓扑观测、网络协议分析与链路晚高峰性能评测基准。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/badge/Release-2026%20Q4-emerald.svg)](https://tizivpn.net)
[![Site](https://img.shields.io/badge/Website-Live-brightgreen.svg)](https://tizivpn.net)

---

## 📖 项目简介

**节点白皮书** 是一个专注于跨境网络通信质量、协议效能与拓扑架构观测的独立技术评测项目。本项目系统性拆解晚高峰骨干链路抗拥塞能力，消除虚假营销与参数虚标，提供客观、透明、可复现的链路评测基准与网络排障指南。

* **线上站点**：[https://tizivpn.net](https://tizivpn.net)
* **发布周期**：季度滚动更新 / 晚高峰实时压测

---

## 🔬 核心研究与模块

1. **晚高峰机场性能评测天梯榜**
   * 晚高峰（20:30 - 23:00）骨干出口拥塞压测
   * IPLC / IEPL 物理专线与优质公网（CN2 GIA、AS9929、CMIN2）端到端丢包率基准
   * 原生住宅 IP、机房 IDC 广播库与流媒体/AI 解锁风险评分

2. **技术白皮书库 (Whitepapers)**
   * `WHITEPAPER-26113`: 机场测速指标深度解读：延迟、抖动、丢包率与单线程吞吐对实际体验的真实影响
   * `WHITEPAPER-26114`: 国际游戏联机与主机跨区加速终极指南：Steam、PS5、Xbox 与 Switch 全优化配置
   * `WHITEPAPER-26115`: 2026 年全平台科学上网客户端生态横评与深度选型指南
   * `WHITEPAPER-26116`: 2026 常见网络节点超时与丢包全解析：从 DNS 污染、MTU 设置到路由绕路的底层诊断手册
   * `WHITEPAPER-26119`: 跨境网络传输瓶颈与拥塞控制调优白皮书：从 TCP 三次握手、BBR 算法到运营商 QoS 限速机制
   * `WHITEPAPER-26120`: 跨境链路质量深度排查：MTR 路由追踪、晚高峰丢包与 IPLC/IEPL 专线抖动优化实战

3. **网络拓扑与排障准则**
   * MTR 路由跳数诊断与 BGP 回程拥塞排查
   * MTU / MSS 分片分包性能调优指南
   * DNS 污染防范与本地防劫持策略

---

## 📂 目录架构

```text
.
├── assets/          # 品牌 LOGO 效果图与视觉资产
├── favicon.svg      # 矢量站点图标
├── logo.svg         # 矢量品牌标识
├── index.html       # 站点首页（核心天梯榜与白皮书索引）
├── posts/           # 深度技术白皮书与专项研究报告 HTML 库
├── robots.txt       # 爬虫索引规则配置
└── sitemap.xml      # 结构化站点地图（全站权重聚合）
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源发布。
