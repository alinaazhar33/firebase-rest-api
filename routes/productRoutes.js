import express from "express";
import { addProduct, getAllProducts,updateProduct,deleteProduct,getProductById,getAllCategories,getLatestProducts} 
from "../controllers/productController.js";

const router = express.Router();

router.post("/add", addProduct);           
router.get("/get", getAllProducts);        
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get/:id", getProductById);
router.get("/categories", getAllCategories);
router.get("/latest", getLatestProducts);


export default router;
