import express from "express";
import Product from "../models/product.model.js";

const productsRouter = express.Router();

// Obtener productos
productsRouter.get("/", async (req, res) => {
	try {
		const { page = 1, limit = 3, sort = "asc" } = req.query;

		const sortOption = {};
		if (sort === "asc") sortOption.price = 1;
		else if (sort === "desc") sortOption.price = -1;

		const data = await Product.paginate({}, {limit, page, sort: sortOption});
		const products = data.docs;
		delete data.docs;

		res.status(200).json({status: "success", payload: products, ...data});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al conseguir productos"});
	}
});

// Obtener producto por Id
productsRouter.get("/:pid", async (req,res) => {
	try {
		const pid = req.params.pid;
		const product = await Product.findById(pid);

		if (!product) return res.status(404).json({ status: "error", message: "Producto con id " + pid + " no encontrado" });

		res.status(200).json({ status: "success", payload: product });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al obtener producto" });
	}
});

// Crear producto
productsRouter.post("/", async (req, res) => {
	try {
		const { title, price, code, stock, category, thumbnail } = req.body;
		const product = new Product({ title, price, code, stock, category, thumbnail });
		await product.save();

		res.status(201).json({status: "success", payload: product});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al crear producto: " + error});
	}
});

// Actualizar producto
productsRouter.put("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const updateData = req.body;

		const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, {new: true, runValidators: true}); // new: retornar producto nuevo. runValidators: pasar validaciones de nuevo
		if (!updatedProduct) return res.status(404).json({status: "error", message: "Producto con id " + pid + " no encontrado"});

		res.status(200).json({ status: "success", payload: updatedProduct });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al actualizar producto: " + error });
	}
});

// Eliminar producto por Id
productsRouter.delete("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const deletedProduct = await Product.findByIdAndDelete(pid);

		if(!deletedProduct) return res.status(404).json({status: "error", message: "Producto con id " + pid + " no encontrado"});
		res.status(200).json({ status: "success", payload: deletedProduct });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al eliminar producto: " + error });
	}
});

export default productsRouter;