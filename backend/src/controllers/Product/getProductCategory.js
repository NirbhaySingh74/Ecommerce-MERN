import { productModel } from "../../models/productModel.js";

export const getCategoryProduct = async (req, res) => {
  try {
    const productCategory = await productModel.distinct("category");
    console.log("category", productCategory);
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
