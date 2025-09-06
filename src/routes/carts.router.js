import express from 'express';
import { cartManager } from '../controllers/cartManager.js';

const cartRouter = express.Router();

// Todos los carritos
cartRouter.get("/", async (req, res) => {
	try {
		const carts = await cartManager.getCarts();
		res.status(200).json({ status: "success", payload: carts });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al obtener carritos" });
	}
})

// Conseguir carrito por id
cartRouter.get("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const cart = await cartManager.getCartById(cid);
		res.status(200).json({ status: "success", payload: cart.products });
	} catch (error) {
		res.status(error.statusCode || 500).json({ status: "error", message: error.message || "Error al obtener carrito"  });
	}
});

// Añadir carrito
cartRouter.post("/", async (req, res) => {
	try {
		const cart = await cartManager.addCart();
		res.status(201).json({ status: "success", payload: cart });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al crear carrito" });
	}
});

// Agregar producto a carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
		res.status(200).json({ status: "success", payload: updatedCart });
	} catch (error) {
		res.status(error.statusCode || 500).json({ status: "error", message: error.message || "Error al agregar producto al carrito" });
	}
});

// Borrar productos de carrito
cartRouter.delete("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const updatedCart = await cartManager.deleteCartById(cid);
		res.status(200).json({ status: "success", message: "Carrito vaciado", payload: updatedCart });
	} catch (error) {
		res.status(error.statusCode || 500).json({ status: "error", message: error.message || "Error al vaciar carrito" });
	}
});

export default cartRouter;