const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require('electron')
const path = require('path')


let win = null
let tray = null

function createWindow() {
  const { bounds } = screen.getPrimaryDisplay()

  win = new BrowserWindow({
    // 全屏透明——水母在里面自由移动，不受窗口边界裁切
    width:  bounds.width,
    height: bounds.height,
    x: 0,
    y: 0,

    // 透明悬浮核心设置
    transparent: true,
    frame: false,
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,           // 不出现在 Dock 任务栏
    focusable: false,            // 不抢焦点

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // 始终置顶，即使用户切换应用
  win.setAlwaysOnTop(true, 'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // 初始：透明部分穿透鼠标（水母区域由 JS 动态控制）
  win.setIgnoreMouseEvents(true, { forward: true })

  win.loadFile(path.join(__dirname, 'index.html'))

  win.webContents.on('did-finish-load', () => {
    setInterval(() => {
      if (!win || win.isDestroyed() || win.webContents.isDestroyed()) return
      try {
        const { x, y } = screen.getCursorScreenPoint()
        win.webContents.send('cursor-pos', x, y)
      } catch (_) {}
    }, 32)
  })

  // win.webContents.openDevTools({ mode: 'detach' })
}

// ── Menu Bar Tray ──
function createTray() {
  // 用一个极小的空图标
  const img = nativeImage.createEmpty()
  tray = new Tray(img)
  tray.setToolTip('JellyMate 🪼')

  const menu = Menu.buildFromTemplate([
    { label: 'JellyMate 🪼', enabled: false },
    { type: 'separator' },
    { label: '显示水母',  click: () => win?.show() },
    { label: '隐藏水母',  click: () => win?.hide() },
    { type: 'separator' },
    { label: '退出',      click: () => app.quit() },
  ])
  tray.setContextMenu(menu)
}

// ── IPC：JS 控制点击穿透 ──
// 水母本体区域：关闭穿透（可交互）
ipcMain.on('mouse-enter-jelly', () => {
  win?.setIgnoreMouseEvents(false)
  win?.setFocusable(true)
})
// 透明背景区域：开启穿透（点击直达下层窗口）
ipcMain.on('mouse-leave-jelly', () => {
  win?.setIgnoreMouseEvents(true, { forward: true })
  win?.setFocusable(false)
})

// 拖拽移动
ipcMain.on('drag-move', (_, { dx, dy }) => {
  if (!win) return
  const [x, y] = win.getPosition()
  win.setPosition(x + dx, y + dy)
})

// 设置绝对位置（贴边吸附）
ipcMain.on('set-position', (_, { x, y }) => {
  win?.setPosition(Math.round(x), Math.round(y))
})

// 面板需要焦点（点击按钮）
ipcMain.on('panel-open',  () => {
  win?.setIgnoreMouseEvents(false)
  win?.setFocusable(true)
})
ipcMain.on('panel-close', () => {
  win?.setIgnoreMouseEvents(true, { forward: true })
  win?.setFocusable(false)
})

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
