import jwt from "jsonwebtoken";

function sign(data) {
  return jwt.sign(data, process.env.SECRET);
}

function verify(data) {
  return jwt.verify(data, process.env.SECRET);
}

export { sign, verify };
