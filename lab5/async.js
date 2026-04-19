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

console.log('=== Callback ===')

asyncMapCallback([10, 20, 30], (x, i, arr, cb) => {
  setTimeout(() => cb(null, x + 5), 50)
}, (err, res) => {
  if (err) console.log(err)
  else console.log(res)
})