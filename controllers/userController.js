import jwt from "jsonwebtoken";

import {getUsersService,deleteUserService,loginUserService,signupUserService,updateUserService,} 
from "../services/userService.js";

// ✅ Get Users
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const data = await getUsersService(page, limit, search);

    res.json({
      currentPage: page,
      totalUsers: data.total,
      totalPages: Math.ceil(data.total / limit),
      users: data.users,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  try {
    const user = await loginUserService(
      req.body.email,
      req.body.password
    );

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "mySecretKey123",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      user,
      token,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Signup
export const signupUser = async (req, res) => {
  try {
    const user = await signupUserService(req.body);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "mySecretKey123",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Signup successful",
      user,
      token,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.body);

    res.json({
      message: "User updated",
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};