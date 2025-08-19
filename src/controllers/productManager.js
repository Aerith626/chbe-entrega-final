import Product from "../models/product.model.js";
import * as Errors from "./errorHandler.js";

class ProductManager {
	async getProducts({page = 1, limit = 5, sort = "asc"}) {
		try {
			const sortOption = {};
			if (sort === "asc") sortOption.price = 1;
			else if (sort === "desc") sortOption.price = -1;
			else throw new Errors.BadRequest('Orden debe ser "asc" o "desc"');

			const data = await Product.paginate({}, {limit, page, sort: sortOption});
			const products = data.docs;
			delete data.docs;
			return {products, pagination: data};
		} catch (error) {
			throw new Errors.Internal(error.message);
		}
	}

	async getProductById(pid) {
		try {
			const product = await Product.findById(pid);
			if (!product) throw new Errors.NotFound(`Producto con id ${pid} no encontrado`);
			return product;
		} catch (error) {
			if (error.name === "CastError" && error.kind === "ObjectId") {
				throw new Errors.BadRequest("Id de producto es inválido");
			}
			throw error;
		}
	}

	async addProduct({ title, description, price, code, stock, category, thumbnail }) {
		try {
			const product = new Product({ title, description, price, code, stock, category, thumbnail });
			return await product.save();
		} catch (error) {
			if (error.code === 11000) throw new Errors.BadRequest(`El código "${error.keyValue.code}" ya existe`);
			throw new Errors.Internal(`Error al crear producto: ${error.message}`);		
		}
	}

	async updateProductById(pid, updateData) {
		try {
			const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, {new: true, runValidators: true});
			if (!updatedProduct) throw new Errors.NotFound(`Producto con id ${pid} no encontrado`);
			return updatedProduct;
		} catch (error) {
			if (error.name === "ValidationError") {
				const messages = Object.values(error.errors).map(e => e.message).join(", ");
				throw new Errors.BadRequest(`Error de validación: ${messages}`);
			}
			if (error.code === 11000) {
				throw new Errors.BadRequest(`Producto con código "${error.keyValue.code}" ya existe.`);
			}
			throw new Errors.Internal(error.message);
		}
	}

	async deleteProductById(pid) {
		const deletedProduct = await Product.findByIdAndDelete(pid);
		if (!deletedProduct) throw new Errors.NotFound(`Producto con id ${pid} no encontrado`);
		return deletedProduct;
	}
}

export default ProductManager;