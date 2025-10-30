import { responseHandler } from "../utils/responseHandler.js";
import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    //* Payload validation
    if (!fullName || !email || !password) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Please provide details of all required fields",
      });
    }

    //* Checking Duplicate User
    const isUser = await User.findOne({ email: email.toLowerCase() });
    if (isUser) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "User already exists. Please login",
      });
    }

    //* Encrypting Password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
    });
    await user.save();
    const { password: _, ...userData } = user._doc;
    return responseHandler({
      res,
      statusCode: 201,
      message: "User Created Successfully",
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error in Signup API: ", error);
    return responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //* Payload Validation
    if (!email || !password) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Please provide details of all the required fields",
      });
    }

    //* Checking for User Existence
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return responseHandler({
        res,
        statusCode: 404,
        message: "User not found. Please Signup first",
      });
    }

    //* Password Matching
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return responseHandler({
        res,
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const { password: _, ...userData } = user._doc;

    //* Creating auth token using JWT
    const payload = { uId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 600000,
      })
      .json({
        message: "User login successfully",
        success: true,
        userData,
      });
  } catch (error) {
    console.error("Erorr in Signin API: ", error);
    return responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const Logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 0,
    })
    .json({
      message: "User logged out successfully",
      success: true,
    });
};
