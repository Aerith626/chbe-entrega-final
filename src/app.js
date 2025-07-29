import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import connectMongoDB from "./config/db.config.js";
import dotenv from "dotenv";
import { engine } from 'express-handlebars';

// Variables de entorno
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
connectMongoDB(); // Conectar db

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
	console.log("Servidor iniciado en " + PORT);
});