var co = require('co')
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

  it('should work with errors', () => co(function* () {
    try {
      yield spawn('laksjdflkajsdf')
      throw new Error('wtf')
    } catch (err) {
      err.code.should.equal('ENOENT')
    }
  }))
})