import mongoose from "mongoose";

const githubUserSchema = new mongoose.Schema({
	githubId: { type: String, required: true, unique: true},
	first_name: { type: String, trim: true },
	last_name: { type: String, trim: true },
	email: { type: String, sparse: true, unique: true, lowercase: true },
	age: { type: Number, min: 0 },
	cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
	role: { type: String, default: "user" },
	thumbnail: { type: String, default: null }
}, { timestamps: true })


export const GithubUserModel = mongoose.model("GithubUser", githubUserSchema);