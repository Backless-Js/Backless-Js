import User from "../models/User";
import { compare } from "../helpers/bcrypt";
import { sign } from "../helpers/jsonwebtoken";

class UserController {
  static async register(req, res, next) {
    try {
      const { fullname, email, password } = req.body;
      const data = await User.create({ fullname, email, password });
      const access_token = sign({ _id: data._id, email: data.email });
      res
        .status(201)
        .json({ message: "User has been registered", data, access_token });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await User.findOne({ email });
      if (data.password) {
        if (compare(password, data.password)) {
          const access_token = sign({ _id: data._id, email: data.email });
          res.status(200).json({ access_token });
        } else {
          throw new Error("Password is Invalid!");
        }
      } else {
        throw new Error("Password is required");
      }
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
