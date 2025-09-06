import { Router } from "express";
import { loginLocalJWT, registerLocalJWT } from "../controllers/sessionController.js";
import passport from "passport";
import { generateToken } from "../utilities/jwt.js";

const sessionRouter = Router();

// Registro local
sessionRouter.post("/register",  registerLocalJWT);
sessionRouter.post("/login", loginLocalJWT);

sessionRouter.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"] })
);

sessionRouter.get(
	"/github/callback",
	passport.authenticate("github", { failureRedirect: "/login", session: false }),
	(req, res) => {
		const user = req.user;
		const token = generateToken({
			id: user._id,
			email: user.email,
			role: user.role,
			provider: "github"
		});

		res.cookie("jwt", token, {
			httpOnly: true,
			secure: false, 
			maxAge: 1000 * 60 * 60,
		});

		res.redirect("/");
	}
);

sessionRouter.get("/current", (req, res, next) => {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) return next(err);

		if (!user) {
			return res.status(401).json({
				message: "Token inválido o inexistente",
				error: info?.message || "Unauthorized",
			});
		}

		const userNoPass = user.toObject ? user.toObject() : user;
		delete userNoPass.password;

		res.json({
			message: "Usuario validado",
			user: userNoPass,
		});
	})(req, res, next);
});

sessionRouter.get("/logout", (req, res) => {
	res.clearCookie("jwt");
	res.redirect("/");
});

export default sessionRouter;
