import electron, { app, Menu, globalShortcut } from 'electron'

import { createTray } from './main-process/createTray'
import { createCircleWindow, createSearchWindow, createSettingWindow } from './main-process/electronWindow'
import { addIpcMain } from './main-process/ipcMain'
import { addShortcut, addUiohook } from './main-process/uiohook'

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)

  createSearchWindow()
  createSettingWindow()

  createTray()
  addIpcMain()

  addUiohook()
  addShortcut()

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// electronReload(__dirname, {
//   electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
//   hardResetMethod: 'exit'
// })
