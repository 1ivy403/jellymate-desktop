# JellyMate 🪼

**屏幕边缘的陪伴 —— 低打扰，有边界感。**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%2012%2B-lightgrey)](https://github.com/1ivy403/jellymate-desktop/releases/latest)

<p align="center">
  <a href="https://jellymate-amber.vercel.app/download"><strong>⬇ 下载 macOS App</strong></a>
  &nbsp;·&nbsp;
  <a href="https://jellymate-amber.vercel.app">产品页</a>
  &nbsp;·&nbsp;
  <a href="https://jellymate-amber.vercel.app/demo"><strong>🪼 查看演示</strong></a>
</p>

> 没有通知，没有弹窗，没有账号。**一只住在屏幕边缘的水母，有自己的节奏，你也保留你的空间。**

---

## 下载安装

前往 **[产品页](https://jellymate-amber.vercel.app)** 下载，或从 [Releases](https://github.com/1ivy403/jellymate-desktop/releases/latest) 选择对应架构的 DMG：

| 机型 | 文件 |
|---|---|
| Apple Silicon（M1 / M2 / M3 / M4） | `JellyMate-x.x.x-arm64.dmg` |
| Intel Mac | `JellyMate-x.x.x.dmg` |

> 安装后若提示「无法打开」：Finder 中右键 App → **打开** → 确认允许即可（未签名应用的 macOS 常规步骤）。

---

## 交互速查

<details>
<summary><strong>展开完整交互表</strong></summary>

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

</details>

**心情系统：** `calm` → `curious` → `focus` → `happy` → `poked` → `sleepy`（夜间自动）

**新手引导：** 首次启动 9 步交互引导；托盘菜单或 `Shift+T` 可随时重置。

---

## 本地开发

**环境要求：** Node.js 18+，macOS 12+

```bash
git clone https://github.com/1ivy403/jellymate-desktop.git
cd jellymate-desktop
npm install
npm start        # Electron 开发模式
npm test         # 渲染层测试
npm run build    # 打包 DMG（macOS only）
```

<details>
<summary><strong>项目结构 & 架构</strong></summary>

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
│   └── renderer.test.js
└── .github/
    └── ISSUE_TEMPLATE/
```

- **无框架，无打包器。** 渲染层是单个 `index.html`，内联 CSS + JS，用 Electron 的 contextBridge 隔离主进程和渲染进程。
- **鼠标穿透。** 窗口全屏透明，默认 `setIgnoreMouseEvents(true, { forward: true })`；仅在鼠标悬停水母区域时关闭穿透。
- **物理旋转。** 拖拽时以角速度 + 阻尼模拟旋转，`requestAnimationFrame` 驱动，与 CSS 动画系统完全独立。

</details>

---

## Roadmap

- [ ] Windows 支持
- [ ] 多水母（同一屏幕可以有多只）
- [ ] 用户自定义心情触发词
- [ ] 插件 / 脚本 API

有想法或 bug？欢迎 [Issues](https://github.com/1ivy403/jellymate-desktop/issues)。

---

## 贡献

欢迎 PR。提交前请先开 Issue 描述你想做的事，避免重复劳动。详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## License

[MIT](LICENSE) © 2026 JellyMate
