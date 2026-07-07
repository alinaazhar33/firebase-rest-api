// services/cartService.js
import { pool } from "../config/db.js";

// ✅ Add to Cart
export const addToCartService = async (userId, productId, quantity) => {
  if (!userId || !productId || !quantity) {
    throw new Error("All fields are required");
  }

  const existing = await pool.query(
    "SELECT * FROM cart WHERE user_id=$1 AND product_id=$2",
    [userId, productId]
  );

  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE cart 
       SET quantity = quantity + $1, updated_at = NOW()
       WHERE user_id=$2 AND product_id=$3`,
      [quantity, userId, productId]
    );

    return "updated";
  }

  await pool.query(
    `INSERT INTO cart (user_id, product_id, quantity)
     VALUES ($1,$2,$3)`,
    [userId, productId, quantity]
  );

  return "added";
};

// ✅ Get Cart
export const getCartService = async (userId) => {
  const result = await pool.query(
    `SELECT
     c.product_id, 
      c.quantity,
      p.product_name,
      p.price,
      p.image_url
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = $1`,
    [userId]
  );

  return result.rows;
};

// ✅ Cart Count
export const getCartCountService = async (userId) => {
  const result = await pool.query(
    "SELECT COALESCE(SUM(quantity), 0) AS total FROM cart WHERE user_id=$1",
    [userId]
  );

  return parseInt(result.rows[0].total); // ✅ FIX
};
// ✅ Update Quantity
export const updateCartQuantityService = async (userId, productId, quantity) => {
  if (quantity < 1) {
    throw new Error("Invalid quantity");
  }

  await pool.query(
    `UPDATE cart 
     SET quantity=$1, updated_at=NOW()
     WHERE user_id=$2 AND product_id=$3`,
    [quantity, userId, productId]
  );
};

// ✅ Remove Item
export const removeFromCartService = async (userId, productId) => {
  await pool.query(
    "DELETE FROM cart WHERE user_id=$1 AND product_id=$2",
    [userId, productId]
  );
};

// ✅ Clear Selected Items
export const clearSelectedItemsService = async (userId, productIds) => {
  await pool.query(
    `DELETE FROM cart 
     WHERE user_id=$1 AND product_id = ANY($2)`,
    [userId, productIds]
  );
};