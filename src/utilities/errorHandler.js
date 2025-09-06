class NotFound extends Error {
	constructor (message) {
		super(message);
		this.name = "NotFoundError";
		this.statusCode = 404;
	}
}

class BadRequest extends Error {
	constructor(message) {
		super(message);
		this.name = "BadRequestError";
		this.statusCode = 400;
	}
}

class Internal extends Error {
	constructor(message) {
		super(message);
		this.name = "InternalError";
		this.statusCode = 500;
	}
}

export { NotFound, BadRequest, Internal };