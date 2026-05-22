const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, globalShortcut } = require('electron')
const path = require('path')

let win  = null
let tray = null

function createWindow() {
  const { bounds } = screen.getPrimaryDisplay()

  win = new BrowserWindow({
    width:  bounds.width,
    height: bounds.height,
    x: 0, y: 0,
    transparent: true,
    frame: false,
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.setAlwaysOnTop(true, 'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

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
}

// ── Menu Bar Tray ──
function createTray() {
  const iconPath = path.join(__dirname, '../assets/icon-1024.png')
  const img = nativeImage.createFromPath(iconPath).resize({ width: 18, height: 18 })
  img.setTemplateImage(true)
  tray = new Tray(img)
  tray.setToolTip('JellyMate 🪼')
  const menu = Menu.buildFromTemplate([
    { label: 'JellyMate 🪼', enabled: false },
    { type: 'separator' },
    { label: '显示水母',          click: () => win?.show() },
    { label: '隐藏水母',          click: () => win?.hide() },
    { label: '交互操作 (Shift+T)', click: () => win?.webContents.send('reset-tutorial') },
    { type: 'separator' },
    { label: '退出',              click: () => app.quit() },
  ])
  tray.setContextMenu(menu)
}

// ── IPC：鼠标穿透控制 ──
ipcMain.on('mouse-enter-jelly', () => {
  win?.setIgnoreMouseEvents(false)
  win?.setFocusable(true)
})
ipcMain.on('mouse-leave-jelly', () => {
  win?.setIgnoreMouseEvents(true, { forward: true })
  win?.setFocusable(false)
})
ipcMain.on('drag-move', (_, { dx, dy }) => {
  if (!win) return
  const [x, y] = win.getPosition()
  win.setPosition(x + dx, y + dy)
})
ipcMain.on('set-position', (_, { x, y }) => {
  win?.setPosition(Math.round(x), Math.round(y))
})
ipcMain.on('panel-open',  () => { win?.setIgnoreMouseEvents(false); win?.setFocusable(true) })
ipcMain.on('panel-close', () => { win?.setIgnoreMouseEvents(true, { forward: true }); win?.setFocusable(false) })

app.whenReady().then(() => {
  createWindow()
  createTray()

  globalShortcut.register('Shift+T', () => {
    win?.webContents.send('reset-tutorial')
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
