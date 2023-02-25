import type { IpcRenderer } from 'electron'

declare global {
  interface Window {
    rmstIpcRenderer: IpcRenderer
  }

  declare const rmstIpcRenderer: IpcRenderer
}
