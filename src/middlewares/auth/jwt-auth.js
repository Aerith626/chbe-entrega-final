import { verifyToken } from "../../utilities/jwt.js"
import { githubUserManager, userManager } from "../../controllers/userManager.js";

export function isAuthenticated(req, res, next) {
	const token = req.cookies.jwt;
	if (!token) return next();

	const decoded = verifyToken(token);
	if (!decoded) return next();
	
	return res.redirect("/");
}

export function requireAuth(req, res, next) {
	const token = req.cookies.jwt;
	if (!token) return res.redirect("/login");

	const decoded = verifyToken(token);
	if (!decoded) return res.redirect("/login");

	req.user = decoded;
	next();
}

export const attachUser = async (req, res, next) => {
	const token = req.cookies?.jwt;
	if (!token) {
		res.locals.user = null; 
		return next();
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		res.locals.user = null;
		return next();
	}

	let user;
	if (decoded.provider === "github") {
		user = await githubUserManager.getItemById(decoded.id);
	} else {
		user = await userManager.getItemById(decoded.id);
	}

	if (user) {
		const userObj = user.toObject();
		delete userObj.password;
		res.locals.user = userObj;
	} else {
		res.locals.user = null;
	}

	next();
};