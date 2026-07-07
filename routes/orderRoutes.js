import express from "express";
import { createOrder,getMyOrders,getOrderById,cancelOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();


router.post("/create",verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getOrderById);
router.delete("/:id",verifyToken, cancelOrder); 

export default router;
