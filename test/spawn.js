var co = require('co')
var path = require('path')
var readable = require('stream').Readable

var spawn = require('..')

var uglifyjs = require.resolve('uglify-js/bin/uglifyjs')

describe('co-spawn', function () {
  it('should work with strings', () => co(function* () {
    var out = yield spawn(uglifyjs, ['-']).end('var a = 1')
    out.should.equal('var a=1;\n')
  }))

  it('should work with streams', () => co(function* () {
    var stream = new readable()
    stream._read = function () {
      this.push('var a = 1')
      this.push(null)
    }
    var out = yield spawn(uglifyjs, ['-']).pump(stream)
    out.should.equal('var a=1;\n')
  }))

  it('should work with spawn errors', () => co(function* () {
    try {
      yield spawn('laksjdflkajsdf', ['foo', 'bar'], {cwd: __dirname})
      throw new Error('wtf')
    } catch (err) {
      err.code.should.equal('ENOENT')
      err.stdout.should.equal('')
      err.stderr.should.equal('')
      err.command.should.equal('laksjdflkajsdf')
      err.args.should.deepEqual(['foo', 'bar'])
      err.options.should.deepEqual({cwd: __dirname})
    }
  }))

  it('should work with program errors', () => co(function* () {
    try {
      yield spawn(path.join(__dirname, 'fixtures', 'error-bin.js'), ['foo', 'bar'], {cwd: __dirname})
      throw new Error('wtf')
    } catch (err) {
      err.code.should.equal(1)
      err.stdout.should.equal('stdout output\n')
      err.stderr.should.containEql('stderr output\n')
      err.stderr.should.containEql('Error: Error message\n')
      err.command.should.equal(path.join(__dirname, 'fixtures', 'error-bin.js'))
      err.args.should.deepEqual(['foo', 'bar'])
      err.options.should.deepEqual({cwd: __dirname})
    }
  }))
})
