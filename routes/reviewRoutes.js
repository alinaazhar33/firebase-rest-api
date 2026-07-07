import express from "express";
import {addReview,getProductReviews,deleteReview} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authmiddleware.js";
const router = express.Router();
// ADD REVIEW
router.post("/products/:productId/reviews",  verifyToken,addReview);
// GET REVIEWS
router.get("/products/:productId/reviews", getProductReviews);
// DELETE REVIEW
router.delete("/products/:productId/reviews/:reviewId", verifyToken, deleteReview);
export default router;
