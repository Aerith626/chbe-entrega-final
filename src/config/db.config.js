import mongoose from "mongoose";
import Product from "../models/product.model.js";

const connectMongoDB = async () => {
	try {
		await mongoose.connect(process.env.URI_MONGODB);
		await Product.syncIndexes(); 
		console.log("Conectado a MongoDB");
	} catch (error) {
		console.log("Error al conectar con MongoDB");
	}
}

export default connectMongoDB;