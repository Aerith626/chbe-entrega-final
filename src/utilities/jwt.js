import jwt from "jsonwebtoken";
import config from "../config/env-config.js";

const EXPIRES_IN = "1h";

export const generateToken = (payload) => {
	return jwt.sign(payload, config.SECRET_KEY, {expiresIn: EXPIRES_IN});
}

export const verifyToken = (token) => {
	try {
		return jwt.verify(token, config.SECRET_KEY);
	} catch (err) {
		return null;
	}
};