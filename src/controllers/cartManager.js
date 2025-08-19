import Cart from "../models/cart.model.js";
import * as Errors from "./errorHandler.js";
import ProductManager from "./productManager.js";

class CartManager {
	async getCarts () {
		return await Cart.find();
	}

	async getCartById(cid) {
		try {
			const cart = await Cart.findById(cid).populate("products.product");
			if (!cart) throw new Errors.NotFound(`Carrito con id ${cid} no encontrado`);
			return cart;
		} catch (error) {
			if (error.name === "CastError" && error.kind === "ObjectId") {
				throw new Errors.BadRequest("Id de carrito es inválido");
			}
			throw error;
		}
	}	

	async addCart() {
		const cart = new Cart();
		return await cart.save();
	}

	async addProductToCart(cid, pid, quantity) {
		try {
			if (quantity <= 0) throw new Errors.BadRequest("Cantidad debe ser mayor a 0");

			const cart = await this.getCartById(cid);

			const productManager = new ProductManager;
			await productManager.getProductById(pid);

			const existingProduct = cart.products.find(p => p.product._id.toString() === pid);

			if (existingProduct) {
				existingProduct.quantity += quantity;
			} else {
				cart.products.push({product: pid, quantity});
			}
			
			return await cart.save();
		} catch (error) {
			throw error;
		}
	}

	async deleteCartById(cid) {
		try {
			const clearedCart = await Cart.findByIdAndUpdate(cid, {$set: {products: []}}, {new: true});
			if (!clearedCart) throw new Errors.NotFound(`Carrito con id ${cid} no encontrado`);
			return clearedCart;
		} catch (error) {
			throw error;
		}
	}
}

export default CartManager;