import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import path from 'path'

type IElectronWindow = {
  circleWindow: BrowserWindow
  searchWindow: BrowserWindow
  settingWindow: BrowserWindow
  NoteWindow: BrowserWindow
  YoudaoTranslateWindow: BrowserWindow
  NumWindow: BrowserWindow
}
export const electronWindow: IElectronWindow = {} as IElectronWindow

const isDev = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined

const preloadPath = path.join(app.getAppPath(), 'packages/preload/dist/index.cjs')
export const iconPath = path.resolve(app.getAppPath(), 'icon.png')
export const trayPath = path.resolve(app.getAppPath(), 'icon.png')

const loadWindow = (win: BrowserWindow, query: Record<string, string>) => {
  const queryString = new URLSearchParams(query).toString()

  const pageUrl = isDev
    ? `${import.meta.env.VITE_DEV_SERVER_URL}?${queryString}`
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString() + '?' + queryString

  win.loadURL(pageUrl)
}

export const createCircleWindow = () => {
  const width = 450
  const height = 450
  const windowOption = {
    width,
    height,
    frame: false,
    transparent: true,
    show: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    useContentSize: true,
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  }

  const win = new BrowserWindow(windowOption)
  loadWindow(win, { ui: 'CircleSearch' })

  electronWindow.circleWindow = win
}

export const createSearchWindow = () => {
  const windowOption: BrowserWindowConstructorOptions = {
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    center: true,
    resizable: false,
    // thickFrame: false, // 设置为 false 时将移除窗口的阴影和动画
    // transparent: true,
    // useContentSize: true,
    icon: iconPath,
    webPreferences: {
      preload: preloadPath
    }
  }

  const win = new BrowserWindow(windowOption)
  loadWindow(win, { ui: 'DirSearch' })

  electronWindow.searchWindow = win

  win.on('blur', () => {
    !isDev && win.hide()
  })
}

export const createSettingWindow = () => {
  const windowOption = {
    icon: iconPath,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: preloadPath
    }
  }

  const win = new BrowserWindow(windowOption)
  win.on('close', evt => {
    evt.preventDefault()
    win.hide()
  })
  loadWindow(win, { ui: 'Setting' })

  electronWindow.settingWindow = win
}

export function createNoteWindow() {
  const windowOption = {
    icon: iconPath,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: preloadPath
    }
  }

  const win = new BrowserWindow(windowOption)
  win.on('close', evt => {
    evt.preventDefault()
    win.hide()
  })
  loadWindow(win, { ui: 'Note' })

  electronWindow.NoteWindow = win
}

export function createNumWindow() {
  const windowOption: BrowserWindowConstructorOptions = {
    icon: iconPath,
    frame: false,
    skipTaskbar: false,
    show: false,
    focusable: false,
    resizable: false,
    width: 240,
    height: 320,
    alwaysOnTop: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  }

  const win = new BrowserWindow(windowOption)
  win.on('close', evt => {
    evt.preventDefault()
    win.hide()
  })
  loadWindow(win, { ui: 'Num' })

  electronWindow.NumWindow = win
}
