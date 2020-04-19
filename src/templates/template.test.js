require = require("esm")(module);
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const chalk = require("chalk");

const app = require("../app");
const { MongoURL } = require("../config/mongoose");

chai.use(chaiHttp);

let headers = {};
let params = {};
before(async () => {
  try {
    await mongoose.connect(MongoURL);
    const db = mongoose.connection;
    await db.dropDatabase();
    let registration = {
      fullname: "User McUser",
      email: "user@mail.com",
      password: "pass",
    };
    const result = await chai.request(app).post("/register").send(registration);
    headers = { access_token: result.body.access_token };
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

describe(chalk.bold.black.bgWhiteBright("CONTOH TEST"), () => {
  describe(chalk.black.bgCyanBright("POST /contoh"), () => {
    let input = {
      //backless-test
    };
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return input data object with status 201", async () => {
        const result = await chai
          .request(app)
          .post("/contoh")
          .send(input)
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 201);
        assert.hasAllKeys(result.body, ["message", "Contoh"]);
        assert.hasAnyKeys(result.body.Contoh, ["_id", "__v"]);
        params = { id: result.body.Contoh._id };
        const keys = Object.keys(input);
        keys.forEach((key) => {
          assert.strictEqual(
            JSON.stringify(result.body.Contoh[key]),
            JSON.stringify(input[key])
          );
        });
      });
    });
    describe(chalk.black.bgGreenBright("FAIL"), () => {
      it("should return unauthenticated error with status 403", async () => {
        const result = await chai.request(app).post("/contoh").send(input);
        assert.strictEqual(result.status, 403);
      });
    });
  });
  describe(chalk.black.bgCyanBright("GET /contoh"), () => {
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return database data array with status 200", async () => {
        const result = await chai
          .request(app)
          .get("/contoh")
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 200);
        assert.isArray(result.body);
      });
    });
  });
  describe(chalk.black.bgCyanBright("GET /contoh/:id"), () => {
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return database data object with status 200", async () => {
        const result = await chai
          .request(app)
          .get(`/contoh/${params.id}`)
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 200);
        assert.strictEqual(result.body._id, params.id);
      });
    });
    describe(chalk.black.bgGreenBright("FAIL"), () => {
      it("should return not found error with status 404", async () => {
        const result = await chai
          .request(app)
          .get(`/contoh/${new ObjectId()}`)
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 404);
      });
      it("should return invalid id error with status 400", async () => {
        const result = await chai
          .request(app)
          .get(`/contoh/${"123"}`)
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 400);
      });
    });
  });
  describe(chalk.black.bgCyanBright("PATCH /contoh/:id"), () => {
    let update = {
      //backless-test
    };
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return updated data object with status 201", async () => {
        const result = await chai
          .request(app)
          .patch(`/contoh/${params.id}`)
          .send(update)
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 201);
        assert.hasAllKeys(result.body, ["message", "updatedContoh"]);
        assert.hasAnyKeys(result.body.updatedContoh, ["_id", "__v"]);
        assert.strictEqual(result.body.updatedContoh._id, params.id);
        const keys = Object.keys(update);
        keys.forEach((key) => {
          assert.strictEqual(
            JSON.stringify(result.body.updatedContoh[key]),
            JSON.stringify(update[key])
          );
        });
      });
    });
  });
  describe(chalk.black.bgCyanBright("PUT /contoh/:id"), () => {
    let update = {
      //backless-test
    };
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return updated data object with status 201", async () => {
        const result = await chai
          .request(app)
          .put(`/contoh/${params.id}`)
          .send(update)
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 201);
        assert.hasAllKeys(result.body, ["message", "updatedContoh"]);
        assert.hasAnyKeys(result.body.updatedContoh, ["_id", "__v"]);
        assert.strictEqual(result.body.updatedContoh._id, params.id);
        const keys = Object.keys(update);
        keys.forEach((key) => {
          assert.strictEqual(
            JSON.stringify(result.body.updatedContoh[key]),
            JSON.stringify(update[key])
          );
        });
      });
    });
  });
  describe(chalk.black.bgCyanBright("DELETE /contoh/:id"), () => {
    describe(chalk.black.bgGreenBright("SUCCESS"), () => {
      it("should return deleted data object with status 200", async () => {
        const result = await chai
          .request(app)
          .delete(`/contoh/${params.id}`)
          .set("access_token", headers.access_token);
        assert.strictEqual(result.status, 200);
        assert.strictEqual(result.body.deletedContoh._id, params.id);
      });
    });
  });
});
