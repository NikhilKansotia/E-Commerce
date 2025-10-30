import { Cart } from "../models/cartModels.js";
import { Product } from "../models/productModels.js";
import { responseHandler } from "../utils/responseHandler.js";

export const AddToCart = async (req, res) => {
  try {
    const uId = req.uId;
    const { productId } = req.body;

    if (!productId) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Please provide details of all required fields",
      });
    }

    const isValidProduct = await Product.findById(productId);
    if (!isValidProduct) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Not a valid product item",
      });
    }

    let cart = await Cart.findOne({ userId: uId });

    if (!cart) {
      cart = new Cart({
        userId: uId,
        products: [],
      });
    }

    const isDuplicate = cart.products?.find(
      (p) => p.productId.toString() === productId
    );
    if (isDuplicate) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "ProductId already exists in cart",
      });
    }

    cart.products.push({ productId, quantity: 1 });
    await cart.save();

    const updatedCart = await Cart.findOne({ userId: uId })
      .populate("products.productId")
      .sort({ updatedAt: -1 });

    responseHandler({
      res,
      statusCode: 201,
      message: "Item added successfully",
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    console.error("Error in AddToCart API: ", error);
    responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const GetCartItems = async (req, res) => {
  try {
    const uId = req.uId;

    const cart = await Cart.findOne({ userId: uId })
      .populate("products.productId")
      .sort({ updatedAt: -1 });

    if (!cart)
      return responseHandler({
        res,
        statusCode: 200,
        message: "Cart is empty",
        success: true,
      });

    responseHandler({
      res,
      statusCode: 200,
      message: "Cart items fetched succuessfully",
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error in GetCartItems: ", error);
    responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const UpdateCartItem = async (req, res) => {
  try {
    const uId = req.uId;
    const { productId, quantity } = req.body;

    if (!productId || quantity === null || quantity === undefined) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Please provide details of all required fields",
      });
    }

    const isValidProduct = await Product.findById(productId);
    if (!isValidProduct) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Not a valid product item",
      });
    }

    if (quantity <= 0) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Invalid Product Quantity",
      });
    }

    let cart = await Cart.findOne({ userId: uId });

    if (!cart || cart.products.length === 0) {
      return responseHandler({
        res,
        statusCode: 404,
        message: "No such product found in your cart",
      });
    }

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (!existingProduct) {
      return responseHandler({
        res,
        statusCode: 404,
        message: "Product not found in your cart",
      });
    }

    const productToUpdate = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (productToUpdate) productToUpdate.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId: uId })
      .populate("products.productId")
      .sort({ updatedAt: -1 });

    responseHandler({
      data: updatedCart,
      res,
      statusCode: 201,
      message: "Cart Item updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in UpdateCartItem API: ", error);
    responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const DeleteCartItem = async (req, res) => {
  try {
    const uId = req.uId,
      { productId } = req.params;

    if (!productId) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "ProductId is required",
      });
    }

    const isValidProduct = await Product.findById(productId);
    if (!isValidProduct) {
      return responseHandler({
        res,
        statusCode: 400,
        message: "Not a valid product item",
      });
    }

    let cart = await Cart.findOne({ userId: uId });

    if (!cart || cart.products.length === 0) {
      return responseHandler({
        res,
        statusCode: 404,
        message: "No such product found in your cart",
      });
    }

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (!existingProduct) {
      return responseHandler({
        res,
        statusCode: 404,
        message: "Product not found in your cart",
      });
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: uId })
      .populate("products.productId")
      .sort({ updatedAt: -1 });
    responseHandler({
      data: updatedCart,
      res,
      statusCode: 201,
      message: "Cart Item Deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in DeleteCartItem API: ", error);
    responseHandler({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const Checkout = async (req, res) => {
  try {
    const uId = req.uId;
    const cart = await Cart.findOne({ userId: uId }).populate(
      "products.productId"
    );

    if (!cart || !cart.products || cart.products.length === 0) {
      return responseHandler({
        res,
        statusCode: 200,
        message: "Cart Empty",
        success: true,
        data: {
          cart: {},
          totalPrice: 0,
        },
      });
    }
    const totalAmount = cart.products.reduce(
      (acc, p) => acc + p.productId?.price * p.quantity,
      0
    );
    responseHandler({
      res,
      statusCode: 200,
      message: "Here's the Checkout Receipt",
      success: true,
      data: {
        cart,
        totalAmount,
      },
    });
  } catch (error) {
    console.log("Error in Checkout API: ", error);
    responseHandler({ res, statusCode: 500, message: "Internal Server Error" });
  }
};
