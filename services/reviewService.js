// services/reviewService.js
import { pool } from "../config/db.js";

// ✅ Add Review
export const addReviewService = async (productId, userId, rating, comment) => {
  if (!userId) {
    throw new Error("Unauthorized user");
  }

  if (rating == null && (!comment || comment.trim() === "")) {
    throw new Error("At least rating or comment is required");
  }

  const result = await pool.query(
    `INSERT INTO reviews (product_id, user_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      productId,
      userId,
      rating || null,
      comment || null,
    ]
  );

  return result.rows[0];
};

// ✅ Get Reviews
export const getProductReviewsService = async (productId) => {
  const result = await pool.query(
    `SELECT 
      r.id,
      r.user_id,
      r.rating,
      r.comment,
      r.created_at,
      u.first_name,
      u.last_name,
      u.first_name || ' ' || u.last_name AS full_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId]
  );

  return result.rows;
};

// ✅ Delete Review
export const deleteReviewService = async (reviewId, userId) => {
  const result = await pool.query(
    `DELETE FROM reviews 
     WHERE id = $1 AND user_id = $2 
     RETURNING *`,
    [reviewId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Review not found or unauthorized");
  }

  return true;
};