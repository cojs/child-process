# Co Spawn

Spawn a child process using `co`. Kind of like `exec`, except you can write to `stdin` and there aren't as many options like timeout or encoding.

## Example

Minify a Javascript in a child process. Useful when the JS files are large and you don't want uglifyjs blocking the event loop.

```js
var fs = require('fs')
var co = require('co')
var spawn = require('co-spawn')
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

## License

The MIT License (MIT)

Copyright (c) 2014 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
