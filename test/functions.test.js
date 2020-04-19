require = require('esm')(module)
const chai = require('chai')
const assert = chai.assert
const { black }= require('chalk')
const path = require('path')
const {
  toPascalCase,
  routeSource,
  addRouting,
  addController,
  addModel,
  generateDocumentation,
  generateTest,
} = require('../src/functions')

describe(black.bgWhite.bold('FUNCTIONS TEST'), () => {
  describe(black.bgCyanBright('toPascalCase'), () => {
    describe(black.bgGreenBright('SUCCESS'), () => {
      it('should return input string in pascal casing', (done) => {
        assert.strictEqual(toPascalCase('backless js'), 'Backless Js')
        assert.strictEqual(toPascalCase('backless-js'), 'Backless-Js')
        done()
      })
    })
  })
  describe(black.bgCyanBright('routeSource'), () => {
    describe(black.bgGreenBright('SUCCESS'), () => {

    })
  })
})