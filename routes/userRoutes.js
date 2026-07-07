// routes/userRoutes.js
import express from "express";
import { getAllUsers, deleteUser, loginUser,signupUser,updateUser} 
from "../controllers/userController.js";

const router = express.Router();

// Routes
router.get("/", getAllUsers);
router.delete("/delete/:id", deleteUser); 
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.put("/update", updateUser);
export default router;
