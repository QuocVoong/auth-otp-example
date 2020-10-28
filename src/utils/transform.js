const transform = (source, mapper) => {
  const destination = {};
  Object.keys(mapper).forEach(function (key) {
    if (typeof mapper[key] === 'string') {
      Object.assign(destination, { [mapper[key]]: source[key] })
    } else if (typeof mapper[key] === 'object') {
      if (typeof mapper[key]['transform'] === 'function') {
        Object.assign(destination, { [mapper[key]['field']]: mapper[key]['transform'](source) })
      } else {
        Object.assign(destination, { [mapper[key]['field']]: source[key] })
      }
    }
  })

  return destination;
}

module.exports = {
  transform
}