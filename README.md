# Co Child Process

Spawn a child process using `co`. Kind of like `exec`, except you can write to `stdin` and there aren't as many options like timeout or encoding.

## Example

Minify a Javascript in a child process. Useful when the JS files are large and you don't want uglifyjs blocking the event loop.

```js
var fs = require('fs')
var co = require('co')
var spawn = require('co-child-process')
// resolve the location of the binary
var uglifyjs = require.resolve('uglify-js/bin/uglifyjs')

co(function* () {
  var stream = fs.createReadStream(__filename)
  var minified = yield spawn(uglifyjs, [
    '-' // tells uglifyjs to check for `stdin`
  ]).pump(stream) // since you can't pipe into the generator
})()
```

## API

### var output = spawn(command, [args], [options])

A wrapper around [child_process.spawn](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options). The arguments are simply passed and are not touched.

Output is always a string, for now.

### var output = spawn(args...).pump(stream)

Pump a stream into the child process' `stdin`. Kind of like `.pipe()` but in the opposite direction.

Must be called on the same tick.

### var output = spawn(args...).end(body)

Write a buffer or string body to `stdin`.

```js
var out = yield spawn(uglifyjs, ['-']).end('var a = 1;')
```

Must be called on the same tick.
