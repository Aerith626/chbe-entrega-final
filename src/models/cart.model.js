import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	products: {
		type: [
			{
			product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
			quantity: { type: Number, default: 1, min: [1, "Cantidad mínima de productos es 1"]}
			}
		],
		default: []
	},
	createdAt: { type: Date, default: Date.now()},
});

export const Cart = mongoose.model("Cart", cartSchema);