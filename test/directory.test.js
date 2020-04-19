const chai = require("chai");
const { expect } = chai;
const fse = require("fs-extra");
const path = require("path");

const directory = require("../src/helpers/directory");

describe("COPY", function () {
  const srcFolder = "samples";
  const destinations = "destinations";
  const destFolder = `${destinations}/${srcFolder}`;
  const sample = "samples/sample.js";

  before(function () {
    fse.createFileSync(sample);
  });

  after(function () {
    const srcpath = path.join(process.cwd(), srcFolder);
    const destpath = path.join(process.cwd(), destinations);
    fse.removeSync(srcpath);
    fse.removeSync(destpath);
  });

  it("successfully copies files", function () {
    const dirpath = path.join(process.cwd(), destFolder);
    directory.copyDirectory(`../../${srcFolder}`, destFolder);

    expect(fse.existsSync(dirpath)).to.equal(true);
  });
});

describe("CREATE", function () {
  const newFolder = "sample";

  afterEach(function () {
    const dirpath = path.join(process.cwd(), newFolder);
    fse.removeSync(dirpath);
  });

  it("succesfully creates folder", function () {
    const dirpath = path.join(process.cwd(), newFolder);
    const feedback = directory.createFolder(newFolder);

    expect(fse.existsSync(dirpath)).to.equal(true);
    expect(feedback).to.be.an("object");
    expect(feedback.message).to.equal("folder created");
  });

  it("fails creating folder, folder is existed", function () {
    fse.mkdirSync(newFolder);

    const feedback = directory.createFolder(newFolder);
    expect(feedback).to.be.an("object");
    expect(feedback.message).to.equal("folder already exists");
  });
});

describe("PATH", function () {
  const newFolder = "sample";
  it("gets CWD path joined with relative path", function () {
    const dirpath = path.join(process.cwd(), newFolder);
    expect(directory.cwdPath(newFolder)).to.equal(dirpath);
  });
});
