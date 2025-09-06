import passport from "passport";
import { generateToken } from "../utilities/jwt.js";
import { userManager } from "./userManager.js";
import { hashPassword } from "../utilities/encryption.js";
import { cartManager } from "./cartManager.js";

export const loginLocalJWT = (req, res, next) => {
	passport.authenticate("login", { session: false }, (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.render("login", { error: info?.message || "Error al iniciar sesión" });

		const token = generateToken({
			id: user._id,
			email: user.email,
			role: user.role,
			provider: "local"
		});

		const userNoPass = user.toObject();
		delete userNoPass.password;

		res.cookie("jwt", token, {
			httpOnly: true,
			secure: false,
			maxAge: 1000 * 60 * 60
		});
		res.redirect("/");
	})(req, res, next);
};

export const registerLocalJWT = async (req, res, next) => {
	try {
		const { email, first_name, last_name, age, thumbnail, password } = req.body || {};

		const existingUser = await userManager.model.findOne({ email });
		if (existingUser) {
			return res.render("login", { error: `Usuario con email ${email} ya existe` });
		}

		const hashedPassword = hashPassword(password);

		const newUser = await userManager.createItem({
			email,
			password: hashedPassword,
			first_name,
			last_name,
			age,
			thumbnail: thumbnail || null,
			cart: await cartManager.createCartForUser(),
			role: "user",
		});

		const userNoPass = newUser.toObject();
		delete userNoPass.password;

		const token = generateToken({
			id: newUser._id,
			email: newUser.email,
			role: newUser.role,
			provider: "local"
		});

		res.cookie("jwt", token, {
			httpOnly: true,
			secure: false, // true si servidor es https
			maxAge: 1000 * 60 * 60, // 1hr
		})

		res.redirect("/");
	} catch (error) {
		next(error);
	}
};