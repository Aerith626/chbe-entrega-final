import * as Errors from "../utilities/errorHandler.js";

export default class MongoDao {
	constructor (model) {
		this.model = model;
	}

	async getAllItems() {
		try {
			return await this.model.find();
		} catch (error) {
			throw new Errors.Internal(error.message)
		}
	}

	async getItemById(id) {
		try {
			const item = await this.model.findById(id);
			if (!item) throw new Errors.NotFound(`Item con ${id} no encontrado`);
			return item; 
		} catch (error) {
			if (error.name === "NotFoundError") throw error;
			throw new Errors.Internal(error.message);
		}
	}

	async createItem(body) {
		try {
			return await this.model.create(body);
		} catch (error) {
			throw new Errors.Internal(error.message);
		}
	}

	async updateItemById(id, body) {
		try {
			const itemToUpdate = await this.model.findByIdAndUpdate(id, body, { new: true });
			if (!itemToUpdate) throw new Errors.NotFound(`Item con ${id} no encontrado`);
			return itemToUpdate; 
		} catch (error) {
			throw new Errors.Internal(error.message);
		}
	}

	async deleteById (id) {
		try {
			const deletedItem = await this.model.findByIdAndDelete(id);
			if (!deletedItem) throw new Errors.NotFound(`Item con ${id} no encontrado`);
			return deletedItem; 
		} catch (error) {
			throw new Errors.Internal(error.message);
		}
	}
}