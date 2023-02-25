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
