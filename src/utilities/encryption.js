import bcrypt from 'bcrypt';

export function hashPassword (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function passValidation (plainPassword, hashedPassword) {
	return bcrypt.compareSync(plainPassword, hashedPassword);
}