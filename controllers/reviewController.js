// controllers/reviewController.js
import {
  addReviewService,
  getProductReviewsService,
  deleteReviewService,
} from "../services/reviewService.js";

// ✅ Add Review
export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;

    const review = await addReviewService(
      productId,
      user?.id,
      rating,
      comment
    );

    return res.status(201).json({
      message: "Review added successfully",
      data: review,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ✅ Get Reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await getProductReviewsService(productId);

    return res.status(200).json({
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// ✅ Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = req.user; // 🔥 logged in user

    await deleteReviewService(reviewId, user.id);

    return res.status(200).json({
      message: "Review deleted successfully",
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};