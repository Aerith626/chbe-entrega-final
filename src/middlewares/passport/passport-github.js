import passport from "passport";
import GithubStrategy from "passport-github2";
import config from "../../config/env-config.js";
import { githubUserManager } from "../../controllers/userManager.js";
import { cartManager } from "../../controllers/cartManager.js";

export function initializePassportGithub() {
	passport.use(
		new GithubStrategy(
			{
				clientID: config.CLIENT_ID_GITHUB,
				clientSecret: config.CLIENT_SECRET_GITHUB,
				callbackURL: "http://localhost:8080/api/sessions/github/callback",
				scope: ["user:email"],
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await githubUserManager.model.findOne({ githubId: profile.id });

					if (!user) {
						const email =
							profile.emails && profile.emails.length > 0
								? profile.emails[0].value
								: null;

						let first_name = null;
						let last_name = null;

						if (profile.displayName) {
							const parts = profile.displayName.trim().split(" ");
							first_name = parts[0];
							if (parts.length > 1) {
								last_name = parts.slice(1).join(" "); // Para nombres con más de 1 apellido
							}
						}

						const avatarUrl = profile.photos?.[0]?.value || null;
						user = await githubUserManager.createItem({
							githubId: profile.id,
							first_name,
							last_name,
							email,
							cart: await cartManager.createCartForUser(),
							thumbnail: avatarUrl
						});
					}

					return done(null, user);
				} catch (err) {
					return done(err, null);
				}
			}
		)
	);
}
