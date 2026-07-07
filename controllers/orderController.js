// controllers/orderController.js
import {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  cancelOrderService
} from "../services/orderService.js";

// ✅ Create Order
export const createOrder = async (req, res) => {
  try {
       const userId = req.user.id; 
       const { items, totalAmount } = req.body;


    const orderId = await createOrderService(
      userId,
      items,
      totalAmount
    );

    res.status(201).json({
      message: "Order created successfully",
      orderId,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ✅ Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await getMyOrdersService(req.user.id);

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// ✅ Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await getOrderByIdService(orderId, req.user.id);

    res.json(order);

  } catch (error) {
    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: "Error fetching order detail",
      error: error.message,
    });
  }
};

// ✅ Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    await cancelOrderService(orderId,req.user.id);

    res.json({ message: "Order cancelled successfully" });

  } catch (error) {
    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: "Error cancelling order",
      error: error.message,
    });
  }
};