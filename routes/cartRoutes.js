import express from "express";
import {addToCart,removeFromCart,getCart, updateCartQuantity,getCartCount,clearSelectedItems} 
from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/cart/add",verifyToken, addToCart);
router.get("/cart",verifyToken, getCart);
router.delete("/cart/:productId",verifyToken, removeFromCart );
router.put("/cart/update",verifyToken, updateCartQuantity);
router.get("/cart/count",verifyToken, getCartCount);
router.post("/clear-selected",verifyToken, clearSelectedItems);

export default router;