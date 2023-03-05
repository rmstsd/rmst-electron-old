import { app } from 'electron'
import './security-restrictions'

import { initElectronApp } from '/@/mainWindow'
import { platform } from 'node:process'
import path from 'node:path'
import spawn from 'cross-spawn'

// Prevent electron from running multiple instances.
const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

// app.on('second-instance', () => {
//   console.log('第二个实例')
//   restoreOrCreateWindow()
// })

app.disableHardwareAcceleration() // Disable Hardware Acceleration to save more system resources.

// Shout down background process if all windows was closed
app.on('window-all-closed', () => {
  if (platform !== 'darwin') app.quit()
})

app
  .whenReady()
  .then(() => {
    initElectronApp()
  })
  .catch(e => console.error('Failed create window:', e))

/**
 * Check for app updates, install it in background and notify user that new version was installed.
 * No reason run this in non-production build.
 * @see https://www.electron.build/auto-update.html#quick-setup-guide
 *
 * Note: It may throw "ENOENT: no such file app-update.yml"
 * if you compile production app without publishing it to distribution server.
 * Like `npm run compile` does. It's ok 😅
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(module => {
      const autoUpdater = module.autoUpdater || (module.default.autoUpdater as typeof module['autoUpdater'])
      return autoUpdater.checkForUpdatesAndNotify()
    })
    .catch(e => console.error('Failed check and install updates:', e))
}
