import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true, trim: true },
	last_name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	age: { type: Number, required: true, min: 0 },
	password: { type: String, required: true },
	cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
	role: { type: String, default: "user" },
	thumbnail: { type: String, default: null }
}, { timestamps: true })


export const UserModel = mongoose.model("User", userSchema);