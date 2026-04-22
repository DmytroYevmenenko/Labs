function asyncMapCallback(arr, fn, callback) {
  const result = []
  let completed = 0
  let finished = false

  if (arr.length === 0) {
    callback(null, result)
    return
  }

  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i, arr, (err, value) => {
      if (finished) return
      if (err) {
        finished = true
        return callback(err)
      }
      result[i] = value
      completed++
      if (completed === arr.length) {
        finished = true
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

function asyncMapAbortable(arr, fn, signal) {
  return new Promise((resolve, reject) => {
    const result = []
    let completed = 0
    let aborted = false

    if (signal && signal.aborted) {
      reject(new Error('Aborted'))
      return
    }

    const onAbort = () => {
      aborted = true
      reject(new Error('Aborted'))
    }

    if (signal) {
      signal.addEventListener('abort', onAbort)
    }

    if (arr.length === 0) {
      resolve(result)
      return
    }

    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(fn(arr[i], i, arr, signal))
        .then(value => {
          if (aborted) return
          result[i] = value
          completed++
          if (completed === arr.length) {
            if (signal) signal.removeEventListener('abort', onAbort)
            resolve(result)
          }
        })
        .catch(err => {
          if (!aborted) reject(err)
        })
    }
  })
}

console.log('=== Callback ===')
asyncMapCallback([10, 20, 30], (x, i, arr, cb) => {
  setTimeout(() => cb(null, x + 5), 50)
}, (err, res) => console.log(res))

console.log('=== Promise with async/await ===')
;(async () => {
  const res = await asyncMapPromise([10, 20, 30], x => x * 3)
  console.log(res)
})()

console.log('=== Abortable ===')
const controller = new AbortController()

setTimeout(() => controller.abort(), 300)

asyncMapAbortable(
  [100, 200, 300],
  async (x, i, arr, signal) => {
    if (signal && signal.aborted) return
    await new Promise(r => setTimeout(r, 200))
    return x / 2
  },
  controller.signal
).catch(console.log)