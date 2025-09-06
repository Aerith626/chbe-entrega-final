import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../../config/env-config.js";
import { UserModel } from "../../models/user.model.js";
import { GithubUserModel } from "../../models/user-github.model.js";

export const initializePassportJWT = () => {
	const opts = {
		jwtFromRequest: ExtractJwt.fromExtractors([
			ExtractJwt.fromAuthHeaderAsBearerToken(),
			(req) => req?.cookies?.jwt || null
		]),
		secretOrKey: config.SECRET_KEY,
	};

	passport.use(
		"jwt",
		new JwtStrategy(opts, async (jwt_payload, done) => {
			try {
				let user;
				if (jwt_payload.provider === "github") {
					user = await GithubUserModel.findById(jwt_payload.id);
				} else {
					user = await UserModel.findById(jwt_payload.id);
				}
				if (user) return done(null, user);
				return done(null, false);
			} catch (err) {
				return done(err, false);
			}
		})
	);
};
