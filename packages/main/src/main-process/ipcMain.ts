import { BrowserWindow, ipcMain, shell } from 'electron'
import fse from 'fs-extra'
import { spawn } from 'cross-spawn'
import Store from 'electron-store'

import { electronWindow } from '../main-process/electronWindow'

const store = new Store()

export const addIpcMain = () => {
  ipcMain.on('hide-focused-win', () => BrowserWindow.getFocusedWindow()?.hide())
  ipcMain.on('open-external', (event, url) => shell.openExternal(url))
  ipcMain.on('hide-circle-search-win', () => electronWindow.circleWindow?.hide())

  ipcMain.on('spawn-open-dir', openSpawnDir)

  ipcMain.on('set-dir-win-size', setDirWinSize)

  ipcMain.handle('project-names-tree', getProjectNamesTree)

  ipcMain.on('set-dirPaths', (evt, value) => store.set('dirNames', value))
  ipcMain.on('set-editorPath', (evt, value) => store.set('editorPath', value))

  ipcMain.handle('get-dirPaths', () => store.get('dirNames'))
  ipcMain.handle('get-editorPath', () => store.get('editorPath'))

  ipcMain.on('clear-ele-store', evt => store.clear())
}

const openSpawnDir = (event, dirPath) => {
  const editorPath = store.get('editorPath') as string
  if (!editorPath) {
    return
  }
  spawn(editorPath, [dirPath], { detached: true })
}

const setDirWinSize = (evt, value) => {
  const { x, y, width } = electronWindow.searchWindow.getBounds()
  electronWindow.searchWindow.setBounds({ x: x + 1, y: y + 1, width: 800, height: value })
}

const getProjectNamesTree = () => {
  const blackList = ['$RECYCLE.BIN', 'System Volume Information']

  const namesTree = ((store.get('dirNames') as string[]) || []).map(item => ({
    name: item.replace(/\\/g, '/'),
    children: fse.readdirSync(item).filter(item => !blackList.includes(item))
  }))

  return namesTree
}
