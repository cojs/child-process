var Spawn = require('child_process').spawn

module.exports = spawn

function spawn(command, args, options, done) {
  // to do: type check for varying arguments
  var stream
  var body

  setImmediate(function () {
    var child = Spawn(command, args, options)
    var stdin = child.stdin
    var stdout = child.stdout
    var stderr = child.stderr

    if (stream) stream.pipe(stdin)
    else if (body) stdin.end(body)

    var out = ''
    var err = ''
    
    if (stderr) {
      stderr.setEncoding('utf8')
      stderr.on('data', onerrdata)
    }
    
    if (stdout) {
      stdout.setEncoding('utf8')
      stdout.on('data', onoutdata)
    }
    
    child.on('error', onerror)
    child.on('close', onclose)

    function onerror(err) {
      cleanup()
      done(err)
    }

    function onclose(code, signal) {
      cleanup()
      if (code === 0 && signal == null) return done(null, out)

      err = new Error('Command failed: ' + command + '\n' + err)
      err.stdout = out
      err.stderr = err
      err.killed = child.killed
      err.code = code
      err.signal = signal
      done(err)
    }

    function onoutdata(chunk) {
      out += chunk
    }

    function onerrdata(chunk) {
      err += chunk
    }

    function cleanup() {
      if (stdout) stdout.removeListener('data', onoutdata)
      if (stderr) stderr.removeListener('data', onerrdata)
      child.removeListener('error', onerror)
      child.removeListener('close', onclose)
    }
  })

  defer.pump = function (_stream) {
    stream = _stream
    return defer
  }

  defer.end = function (_body) {
    body = _body
    return defer
  }

  return defer

  function defer(fn) {
    done = fn
  }
}
