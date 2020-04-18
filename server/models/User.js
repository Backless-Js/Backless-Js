import mongoose, { Schema } from "mongoose";
import { hashed } from "../helpers/bcrypt";

const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Fullname is required."],
  },
  email: {
    type: String,
    unique: [true, "Email already exist."],
    required: [true, "Email is required."],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
});

userSchema.pre("save", function (next) {
  this.password = hashed(this.password);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
