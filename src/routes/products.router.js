import express from "express";
import ProductManager from "../controllers/productManager.js";
const productsRouter = express.Router();
const productManager = new ProductManager;

// Obtener productos
productsRouter.get("/", async (req, res) => {
	try {
		const { page, limit, sort } = req.query;
		const {products, pagination} = await productManager.getProducts({page, limit, sort});
		res.status(200).json({status: "success", payload: products, ...pagination});
	} catch (error) {
		res.status(error.statusCode || 500).json({status: "error", message: error.message || "Error al conseguir productos"});
	}
});

// Obtener producto por Id
productsRouter.get("/:pid", async (req,res) => {
	try {
		const pid = req.params.pid;
		const product = await productManager.getProductById(pid);
		res.status(200).json({ status: "success", payload: product });
	} catch (error) {
		res.status(error.statusCode || 500).json({ status: "error", message: error.message || "Error al obtener producto" });
	}
});

// Crear producto
productsRouter.post("/", async (req, res) => {
	try {
		const product = await productManager.addProduct(req.body);
		res.status(201).json({status: "success", payload: product});
	} catch (error) {
		res.status(error.statusCode || 500).json({ status: "error", message: error.message || "Error al obtener producto" });
	}
});

// Actualizar producto
productsRouter.put("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const updateData = req.body;

		const updatedProduct = await productManager.updateProductById(pid, updateData);
		res.status(200).json({ status: "success", payload: updatedProduct });
	} catch (error) {
		res.status(error.statusCode || 500).json({ status: "error", message: error.message || "Error al actualizar producto" });
	}
});

// Eliminar producto por Id
productsRouter.delete("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const deletedProduct = await productManager.deleteProductById(pid);
		res.status(200).json({ status: "success", payload: deletedProduct });
	} catch (error) {
		res.status(error.statusCode || 500).json({ status: "error", message: error.message || "Error al eliminar producto" });
	}
});

export default productsRouter;