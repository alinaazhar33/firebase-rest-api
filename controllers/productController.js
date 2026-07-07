// controllers/productController.js
import {
  addProductService,
  getAllProductsService,
  updateProductService,
  deleteProductService,
  getProductByIdService,
  getAllCategoriesService,
  getLatestProductsService
} from "../services/productService.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const product = await addProductService(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";

    const products = await getAllProductsService(search, category);

    res.json({ products });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(
      req.params.id,
      req.body
    );
    res.json({
      message: "Product updated successfully",
      product,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    res.json(product);

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// ✅ Get Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();

    res.json({ categories });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Latest Products
export const getLatestProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const products = await getLatestProductsService(limit);

    res.json({ products });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};