require = require("esm")(module);
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const mongoose = require("mongoose");
const chalk = require("chalk");

const app = require("../app");
const { MongoURL } = require("../config/mongoose");
const { compare } = require("../helpers/bcrypt");
const { verify } = require("../helpers/jsonwebtoken");

chai.use(chaiHttp);

before(async () => {
  try {
    await mongoose.connect(MongoURL);
    const db = mongoose.connection;
    await db.dropDatabase();
  } catch (error) {
    console.log(error);
  }
});

after(async () => {
  try {
    const db = mongoose.connection;
    await db.dropDatabase();
  } catch (error) {
    console.log(error);
  }
});

describe(chalk.bold.black.bgWhiteBright("USER TEST"), () => {
  describe(chalk.black.bgCyanBright("POST /register"), () => {
    let registration = {
      fullname: "User McUser",
      email: "user@mail.com",
      password: "pass",
    };
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return registration data object with status 201", async () => {
        const result = await chai
          .request(app)
          .post("/register")
          .send(registration);
        const comparePass = compare(
          registration.password,
          result.body.data.password
        );
        assert.strictEqual(result.status, 201);
        assert.hasAllDeepKeys(result.body, ["message", "data", "access_token"]);
        assert.hasAllDeepKeys(result.body.data, [
          "_id",
          "fullname",
          "email",
          "password",
          "__v",
        ]);
        assert.strictEqual(result.body.data.fullname, registration.fullname);
        assert.strictEqual(result.body.data.email, registration.email);
        assert.strictEqual(comparePass, true);
      });
    });
    describe(chalk.black.bgGreenBright("FAIL"), () => {
      it("should return invalid email error with status 400", async () => {
        registration.email = "userAtMailDotCom";
        const result = await chai
          .request(app)
          .post("/register")
          .send(registration);
        assert.strictEqual(result.status, 400);
      });
      it("should return empty input error with status 400", async () => {
        registration.fullname = "";
        registration.email = "";
        registration.password = "";
        const result = await chai
          .request(app)
          .post("/register")
          .send(registration);
        assert.strictEqual(result.status, 400);
      });
    });
  });
  describe(chalk.black.bgCyanBright("POST /login"), () => {
    let login = {
      email: "user@mail.com",
      password: "pass",
    };
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return access token object with status 200", async () => {
        const result = await chai.request(app).post("/login").send(login);
        assert.strictEqual(result.status, 200);
        assert.hasAllDeepKeys(result.body, ["access_token"]);
        const decoded = verify(result.body.access_token);
        assert.hasAllDeepKeys(decoded, ["_id", "email", "iat"]);
        assert.strictEqual(decoded.email, login.email);
      });
    });
    describe(chalk.black.bgGreenBright("FAIL"), () => {
      it("should return invalid password error with status 400", async () => {
        login.password = "word";
        const result = await chai.request(app).post("/login").send(login);
        assert.strictEqual(result.status, 400);
      });
    });
  });
});
