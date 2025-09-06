import "dotenv/config";

export default {
	PORT: process.env.PORT,
	URI_MONGODB: process.env.URI_MONGODB,
	SECRET_KEY: process.env.SECRET_KEY,
	CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
	CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
}