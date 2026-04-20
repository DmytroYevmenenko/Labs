function asyncMapCallback(arr, fn, callback) {
  const result = []
  let completed = 0

  if (arr.length === 0) {
    callback(null, result)
    return
  }

  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i, arr, (err, value) => {
      if (err) return callback(err)
      result[i] = value
      completed++
      if (completed === arr.length) {
        callback(null, result)
      }
    })
  }
}

function asyncMapPromise(arr, fn) {
  return new Promise((resolve, reject) => {
    const result = []
    let completed = 0

    if (arr.length === 0) {
      resolve(result)
      return
    }

    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(fn(arr[i], i, arr))
        .then(value => {
          result[i] = value
          completed++
          if (completed === arr.length) resolve(result)
        })
        .catch(reject)
    }
  })
}

console.log('=== Callback ===')
asyncMapCallback([10, 20, 30], (x, i, arr, cb) => {
  setTimeout(() => cb(null, x + 5), 50)
}, (err, res) => console.log(res))

console.log('=== Promise ===')
asyncMapPromise([10, 20, 30], x => x * 3)
  .then(console.log)