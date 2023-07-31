import fs from 'fs'
import path from 'path'
import Watcher from 'watcher'

const isWatching = process.argv.at(2) === '-w' || false
const CWD = process.cwd()
const PATH_DIST = path.join(CWD, 'dist')
const WATCH_DIR = 'src/'
const WATCH_TARGET_EVENTS = ['add', 'addDir', 'change', 'rename', 'renameDir']
const WATCH_OPTIONS = { recursive: true, ignore: /\.ts$/ }

if (isWatching) {
  const watcher = new Watcher(WATCH_DIR, WATCH_OPTIONS)

  watcher.on('ready', () => {
    console.log(`🔂 Watching for changes in ${path.join(CWD, WATCH_DIR)}...`)
  })

  watcher.on('all', (event, targetPath) => {
    if (WATCH_TARGET_EVENTS.includes(event)) {
      copyToDist(targetPath)
    }
  })

  watcher.on('close', () => {
    console.log('⛔ Terminating watcher...')
  })

  // CTRL+C
  process.on('SIGINT', () => {
    watcher.close()
  })
} else {
  // Not watching for changes
  copyAll()

  process.exit(0)
}

function copyToDist(targetPath) {
  const newPath = targetPath
    .replace(CWD, '')
    .replace(`${path.sep}${WATCH_DIR.slice(0, -1)}`, PATH_DIST)

  fs.cpSync(targetPath, newPath, {
    recursive: true,
    force: true,
  })

  console.log(`👀 Detected changes in ${targetPath}...`)
}

function copyAll() {
  const srcPath = path.join(CWD, WATCH_DIR)
  const newPath = srcPath
    .replace(CWD, '')
    .replace(`${path.sep}${WATCH_DIR.slice(0, -1)}`, PATH_DIST)

  fs.cpSync(srcPath, newPath, {
    recursive: true,
    force: true,
    filter: (src) => !src.endsWith('.ts'),
  })

  console.log('✅ Build completed')
}
