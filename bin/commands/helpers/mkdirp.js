const fs   = require('fs')
const path = require('path')

const mkdirp = (filePath) => {
    let dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
        return true
    }
    mkdirp(dirname)
    fs.mkdirSync(dirname)
}

module.exports = mkdirp
