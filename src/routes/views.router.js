import express from "express";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

const viewsRouter = express.Router();

// Home
viewsRouter.get("/", async (req,res) => {
	try {
		const { limit = 3, page = 1, sort = "asc", category } = req.query;

		const filter = {};
		if (category) filter.category = category;


		const sortOption = {};
		if (sort === "asc") sortOption.price = 1;
		else if (sort === "desc") sortOption.price = -1;

		const data = await Product.paginate(filter, { limit, page, sort: sortOption, lean: true });
		const products = data.docs;
		delete data.docs;

		const links = [];
		const categories = await Product.distinct("category");

		for (let i = 1; i <= data.totalPages; i++) {
			links.push({text: i, link: `?limit=${limit}&page=${i}${category ? `&category=${category}` : ''}`, active: i == page });
		}

		res.render("home", { products, links, currentPage: page, categories });
	} catch (error) {
		res.status(500).send({message: error.message });
	}
});

// Detalle de producto
viewsRouter.get("/products/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		if (!mongoose.Types.ObjectId.isValid(pid)) {
			return res.status(400).render("404", { message: "Id de producto inválido" });
		}

		const product = await Product.findById(pid).lean();
		if (!product) return res.render("404", { message: "Producto no encontrado" });
		res.render("product", { product });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

export default viewsRouter;