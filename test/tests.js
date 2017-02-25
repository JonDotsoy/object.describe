const expect = require('expect.js')
const padEnd = require('lodash/padEnd')
const get = require('lodash/get')
const last = require('lodash/last')

describe('Module decompose.js', function () {
  describe('decompose(obj) => decomposition', function () {
    it('Simple use', () => {
      const { decompose } = require('../src/decompose')

      const myObj = {
        a: {
          b: 3,
          c: 'string'
        }
      }

      expect(decompose(myObj)).to.eql([
      [ [], { a: { b: 3, c: 'string' } } ],
      [ ['a'], { b: 3, c: 'string' } ],
      [ ['a', 'b'], 3 ],
      [ ['a', 'c'], 'string' ]
      ])
    })

    it('compare pointer/reference', function () {
      const { decompose } = require('../src/decompose')

    // declare
      let a = {}
      let b = {}
      let c = Symbol('c')
      let d = {}
      let e = Symbol('e')
      let f = {}
      let g = 1
      let h = 'string'
      let i = true

    // Circular
      b.b = b
      a.b = b

    // Symbol
      a[c] = d

      d.i = i
      a.h = h
      d.f = f
      f.e = e

      const deMyObj = decompose(a)

      expect(deMyObj[0][1]).to.be(a)
      expect(deMyObj[1][0][0]).to.be(c)
      expect(deMyObj[1][1]).to.be(d)
      expect(deMyObj[2][1]).to.be(i)
      expect(deMyObj[3][1]).to.be(f)
      expect(deMyObj[4][1]).to.be(e)
      expect(deMyObj[5][1]).to.be(b)
    })

    it('demo 1', () => {
      const { decompose } = require('../src/decompose')

      const myObj = { a: { b: 0 }, c: [ { d: 1 }, { e: true } ] }

      const deMyObj = decompose(myObj)

    // // LOGGER
    // const lastDeMyObj = last(deMyObj)

    // console.log('[')
    // deMyObj.forEach((e) => {
    //   const [path, value] = e
    //   process.stdout.write('  ')
    //   process.stdout.write('[ ')
    //   process.stdout.write( padEnd( JSON.stringify( path ), 15 ) )
    //   process.stdout.write(', ')
    //   process.stdout.write( padEnd( JSON.stringify( value ), 38 ) )
    //   if (e===lastDeMyObj) {
    //     process.stdout.write(' ]')
    //   } else {
    //     process.stdout.write(' ],')
    //   }
    //   process.stdout.write('\n')
    // })
    // console.log(']')

      expect(deMyObj).to.be.eql(
        [
        [ [], {'a': {'b': 0}, 'c': [{'d': 1}, {'e': true}]} ],
        [ ['a'], {'b': 0} ],
        [ ['a', 'b'], 0 ],
        [ ['c'], [{'d': 1}, {'e': true}] ],
        [ ['c', '0'], {'d': 1} ],
        [ ['c', '0', 'd'], 1 ],
        [ ['c', '1'], {'e': true} ],
        [ ['c', '1', 'e'], true ],
        [ ['c', 'length'], 2 ]
        ]
    )
    })

    it('Example with muted object', () => {
      const { decompose } = require('../src/decompose')

      const fnToMutableObj = (obj) => Object.assign(obj, {a: Object.assign({}, {b: obj.a.b})})

      const prevObj = {
        a: {
          b: {
            c: 1
          }
        }
      }

      const dePrevObj = decompose(prevObj)

      const nextObj = fnToMutableObj(prevObj)

      const deNextObj = decompose(nextObj)

      expect(dePrevObj).to.be.eql(deNextObj)
      expect(prevObj).to.be.eql(nextObj)
      expect(dePrevObj[0][1]).to.be(deNextObj[0][1])
      expect(dePrevObj[1][1]).not.to.be(deNextObj[1][1])
      expect(dePrevObj[2][1]).to.be(deNextObj[2][1])
      expect(dePrevObj[3][1]).to.be(deNextObj[3][1])
    })
  })

  describe('eql(obj, other) => Boolean', function () {
    it('compare 2 object', () => {
      const { eql } = require('../src/eql')

      console.log( eql.info( {a: 3}, {a: 3} ) )

    })
  })
})
