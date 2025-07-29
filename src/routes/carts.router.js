import express from 'express';
import Cart from '../models/cart.model.js';

const cartRouter = express.Router();

// Todos los carritos
cartRouter.get("/", async (req, res) => {
	try {
		const carts = await Cart.find();
		res.status(200).json({ status: "success", payload: carts });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al obtener carritos" });
	}
})

// Conseguir carrito por id
cartRouter.get("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const cart = await Cart.findById(cid).populate("products.product");
		if (!cart) return res.status(404).json({ status: "error", message: "Carrito con id " + cid + " no encontrado" });

		res.status(200).json({ status: "success", payload: cart.products });
	} catch (error) {
		if (error.name === "CastError" && error.kind === "ObjectId") {
			return res.status(400).json({ status: "error", message: "Id del carrito es inválido" });
		}
		res.status(500).json({ status: "error", message: "Error al obtener carrito"  });
	}
});

// Añadir carrito
cartRouter.post("/", async (req, res) => {
	try {
		const cart = new Cart();
		await cart.save(); // Sincronizar con db
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

		const updatedCart = await Cart.findByIdAndUpdate(cid, { $push : { products: { product: pid, quantity } } }, { new: true });
		res.status(200).json({ status: "success", payload: updatedCart });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al agregar producto al carrito" });
	}
});

// Borrar productos de carrito
cartRouter.delete("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const updatedCart = await Cart.findByIdAndDelete(cid, {products: [], new: true});

		if (!updatedCart) {
			return res.status(404).json({ status: "error", message: "Carrito con id " + cid + " no encontrado" });
		}
		res.status(200).json({ status: "success", message: "Carrito vaciado", payload: updatedCart, new: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", message: "Error al vaciar carrito" });
	}
});

export default cartRouter;