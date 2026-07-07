// services/productService.js
import { pool } from "../config/db.js";

// helper (DB → frontend format)
const formatProduct = (p) => ({
  id: p.id,
  productName: p.product_name,
  productDescription: p.product_description,
  details: p.details,
  imageUrl: p.image_url,
  price: p.price,
  category: p.category,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

// ✅ Add Product
export const addProductService = async (data) => {
  const { productName, productDescription, details, imageUrl, price, category } = data;

  if (!productName || !productDescription || !imageUrl || !price || !category) {
    throw new Error("All fields are required");
  }

  const result = await pool.query(
    `INSERT INTO products 
    (product_name, product_description, details, image_url, price, category, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,NOW())
    RETURNING *`,
    [productName, productDescription, details, imageUrl, price, category]
  );

  return formatProduct(result.rows[0]);
};

// ✅ Get All Products
export const getAllProductsService = async (search, category) => {
  let query = `SELECT * FROM products WHERE 1=1`;
  let values = [];

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    query += ` AND LOWER(product_name) LIKE $${values.length}`;
  }

  if (category) {
    values.push(category.toLowerCase());
    query += ` AND LOWER(category) = $${values.length}`;
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);

  return result.rows.map(formatProduct);
};

// ✅ Update Product
export const updateProductService = async (id, data) => {
  const { productName, productDescription, imageUrl, price, category, details } = data;

  const result = await pool.query(
    `UPDATE products SET
      product_name = COALESCE($1, product_name),
      product_description = COALESCE($2, product_description),
      image_url = COALESCE($3, image_url),
      price = COALESCE($4, price),
      category = COALESCE($5, category),
      details = COALESCE($6, details),
      updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [productName, productDescription, imageUrl, price, category, details, id]
  );

  return formatProduct(result.rows[0]);
};

// ✅ Delete Product
export const deleteProductService = async (id) => {
  await pool.query("DELETE FROM products WHERE id=$1", [id]);
};

// ✅ Get Product By ID
export const getProductByIdService = async (id) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id=$1",
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Product not found");
  }

  return formatProduct(result.rows[0]);
};

// ✅ Get Categories
export const getAllCategoriesService = async () => {
  const result = await pool.query(
    "SELECT DISTINCT category FROM products"
  );

  return result.rows.map(r => r.category);
};

// ✅ Latest Products
export const getLatestProductsService = async (limit) => {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY created_at DESC LIMIT $1",
    [limit]
  );

  return result.rows.map(formatProduct);
};