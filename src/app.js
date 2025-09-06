import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js"
import connectMongoDB from "./config/db.config.js";
import { engine } from 'express-handlebars';
import config from './config/env-config.js';
import passport from "passport";
import cookieParser from "cookie-parser";
import { attachUser } from "./middlewares/auth/jwt-auth.js";
import { initializePassportLocal } from "./middlewares/passport/passport-local.js";
import { initializePassportJWT } from "./middlewares/passport/passport-jwt.js";
import { initializePassportGithub } from "./middlewares/passport/passport-github.js";

// Variables de entorno
const app = express();

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("src/public"));

const PORT = config.PORT || 8080;
connectMongoDB(); // Conectar db

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

// Passport
app.use(passport.initialize());
initializePassportLocal();
initializePassportJWT();
initializePassportGithub();

// Endpoints
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.statusCode || 500).json({
		message: err.message || "Internal server error",
	});
});

app.use((req, res) => {
	res.status(404).render("404");
})

app.listen(PORT, () => {
	console.log("Servidor iniciado en " + PORT);
});