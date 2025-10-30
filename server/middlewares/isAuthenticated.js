import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/responseHandler.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    //* Token not in cookies
    if (!token) {
      return responseHandler({
        res,
        statusCode: 403,
        message: "User not authenticated",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //* Malwared/Corrupted/Expierd Cookie
    if (!decodedToken) {
      return responseHandler({
        res,
        statusCode: 403,
        message: "User not authenticated",
      });
    }
    req.uId = decodedToken.uId;
    next();
  } catch (error) {
    console.error("Error in isAuthenticated middleware: ", error);
    responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};
export default isAuthenticated;
