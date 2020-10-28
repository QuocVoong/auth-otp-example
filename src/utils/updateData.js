const fs = require('fs');
const { writeDataSync } = require('./writeData')
const { DATA_PATH } = require('constants.js')

const updateData = (schema, data) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readdir(DATA_PATH + '/' + schema + '/', (err, files) => {
        if (err) throw reject(err);
        const currentTime   = Math.floor(Date.now() / 1000);
        const path = DATA_PATH + '/' + schema + '/' + data._id + ':' + data.name + ':' +
          data.email.replace('@', 'U+0040').replace('.', 'U+002E') + ':' + currentTime;
        writeDataSync(path, JSON.stringify(data))
        const matchedFile = files.find((file) => file.includes(data._id))
        fs.unlinkSync(DATA_PATH + '/' + schema + '/' + matchedFile)
        resolve(data)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  updateData
}

