const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shelljs = require('shelljs')

const join = p => path.join('./src', p)
const statPath = path.resolve(__dirname, './stats.json')

/**
 * 查询依赖的模块
 */
function findSrcModules() {
  return new Promise((resolve, reject) => {
    fs.readFile(statPath, (err, data) => {
      if (err) {
        throw (err)
      }
      const json = JSON.parse(data)
      const assetsList = json.chunks
      let ret = []
      assetsList.forEach(chunk => {
        const modules = chunk.modules.map(item => item.name)
        ret = ret.concat(modules)
      })
      ret = ret.filter(item => item.indexOf('node_modules') < 0)
      resolve(ret)
    })
  })
}

/**
 * 获取路径下所有的模块
 */
function getAllFiles(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, {
      nodir: true
    }, (err, files) => {
      const ret = files.map(item => {
        return item.replace('./src', '.')
      })
      resolve(ret)
    })
  })
}

async function findUnusedFiles(config = {}) {
  const {
    pattern = './src/**',
    remove = false
  } = config
  try {
    const allChunks = await findSrcModules()
    const curFiles = await getAllFiles(pattern)

    const unUsed = allChunks
      .filter(item => curFiles.indexOf(item) === -1)
      .filter(item => item.indexOf('ignored') === -1)
      .map(item => join(item))

    if (remove) {
      unUsed.forEach(file => {
        shelljs.rm(file)
        console.log(`remove file: ${file}`)
      })
    }
    return unUsed
  } catch (err) {
    throw (err)
  }
}

module.exports = findUnusedFiles