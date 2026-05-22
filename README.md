# JellyMate 🪼

> 一只住在屏幕边缘的小水母，安静地陪你工作、学习和休息。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%2012%2B-lightgrey)](https://github.com/1ivy403/jellymate/releases/latest)
[![Release](https://img.shields.io/github/v/release/1ivy403/jellymate)](https://github.com/1ivy403/jellymate/releases/latest)

![JellyMate demo](https://jellymate-amber.vercel.app/og.png)

---

## 它是什么

JellyMate 是一个常驻桌面的轻量陪伴工具。一只半透明小水母浮在屏幕角落，不打断你的工作流，只是静静存在。你可以：

- 拖着它贴边停靠，它会倾斜身子
- 双击开始 25 分钟专注计时
- 靠近它，它会注意到你
- 不想被打扰时三击让它隐身

没有通知，没有弹窗，没有账号。就是一只水母。

---

## 下载安装

前往 **[产品页](https://jellymate-amber.vercel.app)** 下载，或直接从 [Releases](https://github.com/1ivy403/jellymate/releases/latest) 选择对应架构的 DMG：

| 机型 | 文件 |
|---|---|
| Apple Silicon（M1/M2/M3/M4） | `JellyMate-x.x.x-arm64.dmg` |
| Intel Mac | `JellyMate-x.x.x.dmg` |

安装后如提示"无法打开"，在 Finder 中右键 → 打开，选择允许即可。

---

## 功能一览

| 交互 | 行为 |
|---|---|
| 单击 | 水母游出，说一句话 |
| 双击 | 开始 / 退出 25 分钟专注计时 |
| 三击 | 隐身 / 恢复 |
| 四连击 | 触发 poke 反应 |
| 长按 0.8s | 退下到屏幕边缘 |
| 拖拽 | 移动位置，靠近边缘自动吸附倾斜 |
| 贴边后朝边缘推 | 退下 |
| 靠近（≤130px） | 进入好奇状态 |
| 3 分钟无互动 | 自动半透明，不打扰 |

**心情系统：** calm → curious → focus → happy → poked → sleepy（夜间自动）

**新手引导：** 首次启动自动触发 9 步交互引导；托盘菜单或 `Shift+T` 可随时重置。

---

## 本地开发

**环境要求：** Node.js 18+，macOS 12+

```bash
git clone https://github.com/1ivy403/jellymate.git
cd jellymate
npm install
npm start        # 启动 Electron 开发模式
npm test         # 运行渲染层测试
npm run build    # 打包 DMG（macOS only）
```

### 项目结构

```
jellymate/
├── src/
│   ├── main.js        # Electron 主进程：窗口、托盘、IPC、鼠标穿透
│   ├── preload.js     # contextBridge：向渲染层暴露最小 IPC 接口
│   └── index.html     # 渲染层：全部 UI、动画、交互逻辑（CSS + JS）
├── assets/
│   ├── icon.svg       # 图标矢量源文件
│   ├── icon.icns      # macOS app bundle 图标
│   ├── icon-1024.png  # 托盘图标源图
│   └── dmg-bg.png     # DMG 安装器背景
├── test/
│   └── renderer.test.js  # jsdom 渲染层测试
└── .github/
    └── ISSUE_TEMPLATE/   # Bug report / Feature request 模板
```

### 架构说明

- **无框架，无打包器。** 渲染层是单个 `index.html`，内联 CSS + JS，用 Electron 的 contextBridge 隔离主进程和渲染进程。
- **鼠标穿透。** 窗口全屏透明，默认 `setIgnoreMouseEvents(true, { forward: true })`；仅在鼠标悬停水母区域时关闭穿透。
- **物理旋转。** 拖拽时以角速度 + 阻尼模拟旋转，`requestAnimationFrame` 驱动，与 CSS 动画系统完全独立。

---

## Roadmap

- [ ] Windows 支持
- [ ] 多水母（同一屏幕可以有多只）
- [ ] 用户自定义心情触发词
- [ ] 插件 / 脚本 API

欢迎在 [Issues](https://github.com/1ivy403/jellymate/issues) 提交想法或 bug。

---

## 贡献

欢迎 PR。提交前请先开 Issue 描述你想做的事，避免重复劳动。

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## License

[MIT](LICENSE) © 2026 JellyMate
