import bcryptjs from "bcryptjs";
const saltRounds = 9;

function hashed(password) {
  return bcryptjs.hashSync(password, saltRounds);
}

function compare(password, hashed) {
  return bcryptjs.compareSync(password, hashed);
}

export { hashed, compare };
