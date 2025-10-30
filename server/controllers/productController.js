import { responseHandler } from "../utils/responseHandler.js";
import { Product } from "../models/productModels.js";

export const GetPaginatedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit),
      skip = Number(req.query.skip);
    const totalProducts = await Product.countDocuments();

    //* Get paginated products from DB
    const products = await Product.find().skip(skip).limit(limit);

    responseHandler({
      res,
      statusCode: 200,
      message: "List of Products",
      success: true,
      data: { products, totalProducts },
    });
  } catch (error) {
    console.error("Error in GetPaginatedProducts API: ", error);
    responseHandler({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const AddProduct = async (req, res) => {
  try {
    //! for now just asking user for ImageUrl but later would integrate Cloudinary for media uploads
    const { title, price, stock, description, imageUrl } = req.body;

    //* Payload validation
    if (!title || !price || !stock) {
      return responseHandler({
        res,
        statusCode: 400,
        message:
          "Please provide information regarding all the required fields.",
      });
    }

    const product = new Product({ title, price, stock, description, imageUrl });
    await product.save();
    responseHandler({
      res,
      statusCode: 201,
      message: "Product added successfully",
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Error in AddProduct API: ", error);
    return responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};
