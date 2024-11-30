import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    // res.status(500).json({ message: "All fields are required" });
    return next(errorHandler(400, "All fields are required"));
  }
  //---------------hashing password -------------//
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json("Signup successful");
  } catch (error) {
    // res.status(500).json({ message: error.message });
    next(error);
  }
};
