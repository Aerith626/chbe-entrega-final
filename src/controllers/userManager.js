import { hashPassword, passValidation } from "../utilities/encryption.js";
import { cartManager } from "./cartManager.js";
import * as Errors from "../utilities/errorHandler.js";
import MongoDao from "./mongoDao.js";
import { UserModel } from "../models/user.model.js";
import { GithubUserModel } from "../models/user-github.model.js";

export default class UserManager extends MongoDao {

	constructor(model) {
		super(model);
	}

	async getUserByEmail(email) {
		if (!email) return null;

		try {
			const user = await this.model.findOne({ email });
			if (!user) throw new Errors.NotFound(`Usuario con email ${email} no encontrado`);
			return user;
		} catch (error) {
			if (error instanceof Errors.NotFound) throw error;
			throw new Errors.Internal(error.message);
		}
	}

	// Passport local
	async registerLocal(userData) {
		try {
			const { email, password } = userData;

			const existing = await this.model.findOne({ email });
			if (existing) throw new Errors.BadRequest("El usuario ya existe");

			const newCartId = await cartManager.createCartForUser();

			const newUser = await this.model.create({
				...userData,
				password: hashPassword(password),
				cart: newCartId,
			});

			return newUser;
		} catch (error) {
			throw error;
		}
	}

	async loginLocal(req, res, next) {
		try {
			const { email, password } = req.body;

			const user = await this.getUserByEmail(email);
			if (!user) return res.status(401).json({ message: "Usuario no existente" });

			const valid = passValidation(password, user.password);
			if (!valid) return res.status(401).json({ message: "Contraseña inválida" });

			const userNoPass = user.toObject();
			delete userNoPass.password;
			res.json({ message: "Sesión iniciada", user: userNoPass });
		} catch (error) {
			next(error);
		}
	}

	// Github login
	async loginGithub(profile, done) {
		try {
			let user = await this.model.findOne({ githubId: profile.id });
			if (!user) {
				user = await this.createItem({
					githubId: profile.id,
					first_name: profile.name?.givenName || null,
					last_name: profile.name?.familyName || null,
					email: profile.emails?.[0]?.value || null,
					cart: await cartManager.createCartForUser(),
				});
			}
			return done(null, user);
		} catch (error) {
			return done(error, null);
		}
	}
}

export const userManager = new UserManager(UserModel);
export const githubUserManager = new UserManager(GithubUserModel);