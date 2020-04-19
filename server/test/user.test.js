require = require('esm')(module)
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const mongoose = require('mongoose')
const chalk = require('chalk')

const app = require('../app')
const { MongoURL } = require('../config/mongoose')
const { compare } = require('../helpers/bcrypt')
const { verify } = require('../helpers/jsonwebtoken')

chai.use(chaiHttp)

before((done) => {
  mongoose.connect(MongoURL, (error) => {
    if (!error) {
      const db = mongoose.connection
      db.dropCollection('users')
      db.createCollection('users')
      done()
    } else {
      done(error)
    }
  })
})

after((done) => {
  const db = mongoose.connection
  db.dropCollection('users')
  done()
})

describe(chalk.bold.black.bgWhiteBright('USER TEST'), () => {
	describe(chalk.black.bgCyanBright('POST /register'), () => {
    let registration = {
      fullname: 'User McUser',
      email: 'user@mail.com',
      password: 'pass',
    }
		describe(chalk.black.bgGreenBright('SUCCESS'), () => {
			it('should return registration data object with status 201', async () => {
        const result = await chai.request(app).post('/register').send(registration)
				const comparePass = compare(registration.password, result.body.data.password)
        assert.strictEqual(result.status, 201)
        assert.hasAllDeepKeys(result.body, [ 'message', 'data', 'access_token' ])
        assert.hasAllDeepKeys(result.body.data, [ '_id', 'fullname', 'email', 'password', '__v' ])
				assert.strictEqual(result.body.data.fullname, registration.fullname)
				assert.strictEqual(result.body.data.email, registration.email)
        assert.strictEqual(comparePass, true)
        console.log(chalk.greenBright('RESULT'), JSON.stringify(result.body))
			})
    })
    describe(chalk.black.bgGreenBright('FAIL'), () => {
			it('should return duplicate email error with status 500', async () => {
        const result = await chai.request(app).post('/register').send(registration)
        assert.strictEqual(result.status, 500)
        console.log(chalk.greenBright('ERROR'), result.body.error.errmsg)
      })
      it('should return invalid email error with status 400', async () => {
        registration.email = 'userAtMailDotCom'
        const result = await chai.request(app).post('/register').send(registration)
        assert.strictEqual(result.status, 400)
        console.log(chalk.greenBright('ERROR'), result.body.error.message)
			})
      it('should return empty input error with status 400', async () => {
        registration.fullname = ''
        registration.email = ''
        registration.password = ''
        const result = await chai.request(app).post('/register').send(registration)
        assert.strictEqual(result.status, 400)
        console.log(chalk.greenBright('ERROR'), result.body.error.message)
			})
    })
  })
  describe(chalk.black.bgCyanBright('POST /login'), () => {
    let login = {
      email: 'user@mail.com',
      password: 'pass',
    }
		describe(chalk.black.bgGreenBright('SUCCESS'), () => {
      it('should return access token object with status 200', async () => {
        const result = await chai.request(app).post('/login').send(login)
        assert.strictEqual(result.status, 200)
        assert.hasAllDeepKeys(result.body, [ 'access_token' ])
        const decoded = verify(result.body.access_token)
        assert.hasAllDeepKeys(decoded, [ '_id', 'email', 'iat' ])
        assert.strictEqual(decoded.email, login.email)
        console.log(chalk.greenBright('RESULT'), JSON.stringify(result.body))
      })
    })
    describe(chalk.black.bgGreenBright('FAIL'), () => {
      it('should return invalid password error with status 400', async () => {
        login.password = 'word'
        const result = await chai.request(app).post('/login').send(login)
        assert.strictEqual(result.status, 400)
        console.log(chalk.greenBright('ERROR'), result.body.error.message)
			})
    })
  })
})