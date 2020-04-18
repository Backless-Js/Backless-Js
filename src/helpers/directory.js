import path from "path";
import fs from "fs-extra";

function createFolder() {
  const directory = path.join(process.cwd(), "./server");
  let message;
  if (!fs.existsSync(process.cwd())) {
    fs.mkdirSync(process.cwd());
    message = "Server has been created.";
  } else {
    message = "Server already exist.";
  }
  return { message, directory };
}

function copyDirectory(source, destination) {
  const sourcePath = path.join(__dirname, source);
  const destinationPath = path.join(process.cwd(), destination);
  return fs.copySync(sourcePath, destinationPath);
}

function workingDirectory(relativePath) {
  const directory = path.join(process.cwd(), relativePath);
  return directory;
}

export { workingDirectory, createFolder, copyDirectory };
