/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const { getVersion } = await import('./version/getVersion.mjs')

  return {
    files: ['packages/**/dist/**', 'icon.png'],
    directories: {
      output: 'dist'
    },
    // asar: false, // 未解决的问题: asar 为true 的时候, swan 会找不到 keyMap.exe
    win: {
      target: ['msi', 'nsis'],
      icon: 'icon.png'
    },
    nsis: {
      oneClick: false,
      language: '2052',
      perMachine: true,
      allowToChangeInstallationDirectory: true,
      deleteAppDataOnUninstall: true
    }
  }
}
