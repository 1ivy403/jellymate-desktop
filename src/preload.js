const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // ── 水母交互 ──
  mouseEnterJelly: ()         => ipcRenderer.send('mouse-enter-jelly'),
  mouseLeaveJelly: ()         => ipcRenderer.send('mouse-leave-jelly'),
  dragMove:        (dx, dy)   => ipcRenderer.send('drag-move', { dx, dy }),
  setPosition:     (x, y)     => ipcRenderer.send('set-position', { x, y }),
  panelOpen:       ()         => ipcRenderer.send('panel-open'),
  panelClose:      ()         => ipcRenderer.send('panel-close'),
  onCursorPos:     (cb)       => ipcRenderer.on('cursor-pos', (_, x, y) => cb(x, y)),
  onResetTutorial: (cb)       => ipcRenderer.on('reset-tutorial', () => cb()),

  // ── 工具 ──
  openExternal:    (url)      => shell.openExternal(url),
})
