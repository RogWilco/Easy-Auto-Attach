'use strict'

const fs = require('fs')
const os = require('os')
const EasyAttach = require('easy-attach')

const LABEL_GLOBAL = 'easy-auto-attach'

/**
 * Wraps easy-attach to provide a config to enable always-on auto
 * attaching of the debugger.
 *
 * @param {Object} options 
 */
const EasyAutoAttach = function (options = {}) {
  options = Object.assign({
    label: '@workspace',
    continue: true,
    eagerExitDebugProxy: true,
    showUI: false,
    msDelay: 1000
  }, options)

  switch (options.label) {
    case '@global':
      options.label = setLabel(os.homedir(), LABEL_GLOBAL)
      break

    case '@workspace':
      let path = getWorkspaceRoot(module.parent.filename)
      let label = path.substring(1).toLowerCase().split('/').join('-')

      options.label = setLabel(path, label)
      break

    default:
      // Leave it alone.
  }

  const result = EasyAttach(options)
  wait(options.msDelay)

  return result
}

/**
 * Blocks execution for at least the specified number of miliseconds.
 *
 * @param {Number} ms the numebr of miliseconds to wait
 */
function wait (ms) {
  let start = new Date().getTime()
  let end = start

  while (end < start + ms) {
    end = new Date().getTime()
  }
}

/**
 * Writes the debug label to the nearest VS Code settings.json.
 *
 * @param {String} path the path to be traversed
 * @param {String} label the debug label to be used
 *
 * @returns {String} the applied label
 */
function setLabel (path, label) {
  let settings = {}

  try {
    settings = require(`${path}/.vscode/settings.json`)
  } catch (e) {}

  if (label) {
    settings['rpcServer.nodeDebugger.autoAttachLabels'] = [ label ]
  } else {
    delete settings['rpcServer.nodeDebugger.autoAttachLabels']
  }

  fs.writeFileSync(`${path}/.vscode/settings.json`, JSON.stringify(settings, null, 4))

  return label
}

/**
 * Returns the path to the workspase root (nearest parent with a .vscode directory).
 *
 * @param {String} path the starting path
 *
 * @returns {String} the resulting parent
 *
 * @throws {Error} when no workspace is found
 */
function getWorkspaceRoot (path) {
  if (!path) {
    throw new Error('No VS Code workspace could be found!')
  }

  try {
    fs.accessSync(`${path}/.vscode`)
    return path
  } catch (e) {
    return getWorkspaceRoot(path.substring(0, path.lastIndexOf('/')))
  }
}

module.exports = EasyAutoAttach
