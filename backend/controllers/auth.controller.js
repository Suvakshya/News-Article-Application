import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    // res.status(500).json({ message: "All fields are required" });
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "wrong Credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc; // here seperating password with other user detail and sending the seperated user details below
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest); // sending seperated user detail
  } catch (error) {
    next(error);
  }
};
