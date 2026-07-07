  // controllers/cartController.js
  import {
    addToCartService,
    getCartService,
    getCartCountService,
    updateCartQuantityService,
    removeFromCartService,
    clearSelectedItemsService
  } from "../services/cartService.js";

  // ✅ Add to Cart
  export const addToCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      const result = await addToCartService(userId, productId, quantity);

      if (result === "updated") {
        return res.json({ message: "Cart updated successfully" });
      }

      res.status(201).json({ message: "Product added to cart" });

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // ✅ Get Cart
  export const getCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await getCartService(userId);

      res.json({ cart });

    } catch (error) {
      res.status(500).json({
        message: "Error fetching cart",
        error: error.message
      });
    }
  };

  // ✅ Cart Count
  export const getCartCount = async (req, res) => {
    try {
      const userId = req.user.id;
      const totalItems = await getCartCountService(userId);

      res.json({ totalItems });

    } catch (error) {
      res.status(500).json({
        message: "Error fetching cart count",
        error: error.message
      });
    }
  };

  // ✅ Update Quantity
  export const updateCartQuantity = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      await updateCartQuantityService(userId, productId, quantity);

      res.json({ message: "Quantity updated" });

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // ✅ Remove Item
  export const removeFromCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      await removeFromCartService(userId, productId);

      res.json({ message: "Item removed from cart" });

    } catch (error) {
      res.status(500).json({
        message: "Error removing item",
        error: error.message
      });
    }
  };

  // ✅ Clear Selected Items
  export const clearSelectedItems = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productIds } = req.body;

      await clearSelectedItemsService(userId, productIds);

      res.json({ message: "Paid items removed from cart" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };