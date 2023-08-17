import { IpcRenderer, ipcRenderer, contextBridge } from 'electron'

const rmstIpcRenderer = {} as IpcRenderer
// 对原型链的属性也遍历
for (const key in ipcRenderer) {
  rmstIpcRenderer[key] = ipcRenderer[key]
}

console.log(rmstIpcRenderer)

export { rmstIpcRenderer }

contextBridge.exposeInMainWorld('electronAPI', {
  onFanyi: callback => ipcRenderer.on('fanyi-data', callback)
})
