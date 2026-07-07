// services/orderService.js
import { pool } from "../config/db.js";

  // ✅ Create Order
  export const createOrderService = async (userId, items, totalAmount) => {
  if (!userId || !items || items.length === 0) {
    throw new Error("Missing fields");
  }
  const paymentMethod = "CARD";
  const isPaid = paymentMethod === "CARD" ? true : false;

  const orderResult = await pool.query(
    `INSERT INTO orders 
     (user_id, total_price, status, created_at, delivery_date, is_paid, payment_method, order_number)
     VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '3 days', $4, $5, $6)
     RETURNING *`,
    [
      userId,
      totalAmount,
      "Pending",
      isPaid,
      paymentMethod,
      `ORD-${Date.now()}`
    ]
  );

  const order = orderResult.rows[0];

  for (const item of items) {
    await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ($1,$2,$3,$4)`,
       [order.id, item.productId, Number(item.quantity), Number(item.price) / Number(item.quantity)]
    );
  }

  return order.id;
};

  // ✅ Get My Orders
  export const getMyOrdersService = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM orders
     WHERE user_id=$1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows.map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    totalAmount: order.total_price,
    createdAt: order.created_at,
  }));
};

  // ✅ Get Order By ID
  export const getOrderByIdService = async (id, userId) => {
  const orderResult = await pool.query(
    "SELECT * FROM orders WHERE id=$1 AND user_id=$2",
    [id, userId]
  );

  if (orderResult.rows.length === 0) {
    throw new Error("Order not found");
  }

  const itemsResult = await pool.query(
    `SELECT 
      oi.quantity,
      oi.price,
      p.product_name,
      p.image_url
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [id]
  );

  const order = orderResult.rows[0];

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    totalAmount: order.total_price,
    createdAt: order.created_at,
    deliveryDate: order.delivery_date,
    isPaid: order.is_paid,
    paymentMethod: order.payment_method,

    items: itemsResult.rows.map(item => ({
      name: item.product_name,
      imageUrl: item.image_url,
      price: item.price,
      quantity: item.quantity,
    })),
  };
};

  // ✅ Cancel Order
   export const cancelOrderService = async (id, userId) => {
  const orderResult = await pool.query(
    "SELECT * FROM orders WHERE id=$1 AND user_id=$2",
    [id, userId]
  );

  if (orderResult.rows.length === 0) {
    throw new Error("Order not found");
  }

  await pool.query(
    "UPDATE orders SET status='Cancelled' WHERE id=$1",
    [id]
  );

  return true;
};