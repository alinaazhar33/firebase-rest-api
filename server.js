import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes    from  "./routes/cartRoutes.js";
import stripeRoutes   from "./routes/stripeRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";


dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: "10mb" })); 
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {

res.send("API is running successfully 🚀");

});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api", cartRoutes);
app.use("/payment", stripeRoutes);
app.use("/orders", orderRoutes);
app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});