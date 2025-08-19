import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
	title: {type: String, required: [true, "Debe ingresar el título del producto."]},
	description: { type: String, required: [true, "Debe ingresar una descripción para el artículo."], index: "text"},
	thumbnail: {type: String, default: ""},
	code: {type: String, unique: true},
	price: {type: Number, required: [true, "Debe ingresar un precio para el artículo."], min: [0, "El precio del producto debe ser un número positivo."]},
	stock: {type: Number, required: [true, "Debe ingresar stock del artículo."], min: [0, "El stock del producto debe ser un número positivo."]},
	category: {type: String, index: true, required: [true, "Debe ingresar la categoría del producto."]},
	status: {type: Boolean, default: true },
	created_at: {type: Date, default: Date.now() }
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;