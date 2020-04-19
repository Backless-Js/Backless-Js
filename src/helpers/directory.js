import path from "path";
import fs from "fs-extra";

function createFolder(folder) {
  const directory = path.join(process.cwd(), folder);
  let message;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
    message = "Server has been created.";
  } else {
    message = "Server already exist.";
    throw new Error("Server already exist.");
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
