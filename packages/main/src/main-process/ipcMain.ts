import { BrowserWindow, ipcMain, shell, clipboard } from 'electron'
import fse from 'fs-extra'
import { spawn } from 'cross-spawn'
import cmd from 'node-cmd'
import Store from 'electron-store'

import { electronWindow } from '../main-process/electronWindow'
import { getContent, updateContent } from './githubApi'
import youdaoTranslate from './youDaoApi'

import { Key, keyboard } from '@nut-tree/nut-js'

const store = new Store()

export const addIpcMain = () => {
  ipcMain.on('hide-focused-win', () => BrowserWindow.getFocusedWindow()?.hide())
  ipcMain.on('open-external', (event, url) => shell.openExternal(url))
  ipcMain.on('hide-circle-search-win', () => electronWindow.circleWindow?.hide())

  ipcMain.on('spawn-open-dir', openSpawnDir)

  ipcMain.on('node-cmd-dir', nodeCmdDir)

  ipcMain.on('set-dir-win-size', setDirWinSize)

  ipcMain.handle('project-names-tree', getProjectNamesTree)

  ipcMain.on('set-dirPaths', (evt, value) => store.set('dirNames', value))
  ipcMain.on('set-editorPath', (evt, value) => store.set('editorPath', value))
  ipcMain.on('set-cmdPath', (evt, value) => store.set('cmdPath', value))

  ipcMain.handle('get-dirPaths', () => store.get('dirNames'))
  ipcMain.handle('get-editorPath', () => store.get('editorPath'))
  ipcMain.handle('get-cmdPath', () => store.get('cmdPath'))

  // test
  ipcMain.handle('test-handle', () => {
    electronWindow.NumWindow.hide()
  })

  ipcMain.on('clear-ele-store', evt => store.clear())

  ipcMain.handle('get-content', getContent)
  ipcMain.handle('update-content', (evt, content, sha) => updateContent(content, sha))
  ipcMain.handle('copy-text', (evt, content) => {
    clipboard.writeText(content)
  })
  ipcMain.handle('youdao-translate', (evt, word: string) => youdaoTranslate(word))

  ipcMain.on('set-num-win-size', (evt, value) => {
    electronWindow.NumWindow.setBounds({ height: value })
  })

  ipcMain.on('press-char', (evt, value) => {
    console.log(value)

    if (value === 'enter') {
      keyboard.pressKey(Key.Enter)

      return
    }

    if (value === '.') {
      keyboard.type(Key.Minus)
      return
    }

    keyboard.type(value)
  })

  ipcMain.on('press-char-rrr ', (evt, value) => {
    console.log('hh', value)
  })
}

const openSpawnDir = (event, dirPath) => {
  const editorPath = store.get('editorPath') as string
  if (!editorPath) {
    return
  }
  spawn(editorPath, [dirPath], { detached: true })
}

const nodeCmdDir = (event, dirPath) => {
  const cmdPath = store.get('cmdPath') as string
  if (!cmdPath) {
    return
  }

  cmd.runSync(`${cmdPath} -d ${dirPath}`)
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
