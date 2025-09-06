import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userManager } from "../../controllers/userManager.js";
import { passValidation } from "../../utilities/encryption.js";


export const initializePassportLocal = () => {
	passport.use(
		"login",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true,
			},
			async (req, email, password, done) => {
				try {
					const user = await userManager.getUserByEmail(email);
					if (!user) return done(null, false, { message: "Usuario no existe" });

					const validatePassword = passValidation(password, user.password);
					if (!validatePassword) return done(null, false, { message: "Contraseña inválida" });

					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

};
