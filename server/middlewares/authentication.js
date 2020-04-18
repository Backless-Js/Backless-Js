import { verify } from "../helpers/jsonwebtoken";

function authentication(req, res, next) {
  try {
    let { access_token } = req.headers;
    req.user = verify(access_token);
    next();
  } catch (error) {
    next(error);
  }
}

export default authentication;
