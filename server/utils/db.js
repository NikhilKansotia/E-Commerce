import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw "Jwt Not found";
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection to Database successfull");
  } catch (error) {
    console.error("Error in connecting to Database: ", error);
    process.exit(1);
  }
};

export default connectToDB;
