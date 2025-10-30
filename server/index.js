//* library/package imports
import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

//* module imports
import connectToDB from "./utils/db.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import isAuthenticated from "./middlewares/isAuthenticated.js";

configDotenv();

const app = express();
const PORT_NO = process.env.PORT_NO || 5000;

//* Middlwares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//* Apis
app.get("/api/testRoute", (req, res) => {
  res.send({
    message: "Test Successfull",
    success: true,
  });
});
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", isAuthenticated, cartRouter);

//* Datetbase connection and Server initialisation
connectToDB()
  .then(() => {
    app.listen(PORT_NO, () => {
      console.log(`Listening to PORT NO: ${PORT_NO}`);
    });
  })
  .catch((err) => {
    console.error("Error in server initialisation: ", err);
    process.exit(1);
  });
