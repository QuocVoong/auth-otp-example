const fs = require('fs');
const util = require('util');
const { DATA_PATH } = require('constants.js')

const readFile = util.promisify(fs.readFile);

const find = (schema, filter) => {
  return new Promise((resolve, reject) => {
    const result = [];
    fs.readdir(DATA_PATH + '/' + schema + '/', async (err, files) => {
      if (err) throw reject(err);

      for (const file of files) {
        if (Object.keys(filter).length > 0) {
          if (Object.values(filter).every(v => {
            return file.includes(v.replace('@', 'U+0040').replace('.', 'U+002E'))
          })) {
            const data = await readFile(DATA_PATH + '/' + schema + '/' + file)
            result.push(JSON.parse(data))
          }
        } else {
          const data = await readFile(DATA_PATH + '/' + schema + '/' + file)
          result.push(JSON.parse(data))
        }
      }
      resolve(result)
    })
  })

}

const findOne = (schema, filter) => {
  return new Promise((resolve, reject) => {
    fs.readdir(DATA_PATH + '/' + schema + '/', async (err, files) => {
      if (err) throw reject(err);
      const matchedFile = files.find((file) => {
        return Object.values(filter).every(v => {
          return file.includes(v.replace('@', 'U+0040').replace('.', 'U+002E'))
        })
      })

      if (matchedFile) {
        const data = await readFile(DATA_PATH + '/' + schema + '/' + matchedFile)
        resolve(JSON.parse(data))
      } else {
        resolve(undefined)
      }
    })
  })
}

const count = async (schema, filter) => {
  const data = await find(schema, filter)
  return data.length;
}

module.exports = {
  find,
  findOne,
  count
}