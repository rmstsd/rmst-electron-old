/**
 * @module preload
 */

import { IpcRenderer, ipcRenderer } from 'electron'

const rmstIpcRenderer = {} as IpcRenderer
// 对原型链的属性也遍历
for (const key in ipcRenderer) {
  rmstIpcRenderer[key] = ipcRenderer[key]
}

export { rmstIpcRenderer }
