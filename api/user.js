const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const encryptPassword = (password) => {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt);
	};

	const save = async (req, res) => {
		const user = {
			...req.body,
		};

		if (req.params.id) user.id = req.params.id;

		try {
			existsOrError(user.name, "Nome não informado");
			existsOrError(user.email, "E-mail não informado");
			existsOrError(user.password, "Senha não informada");
			existsOrError(user.confirmPassword, "Confirmação de senha inválida");
			equalsOrError(user.password, user.confirmPassword, "Senhas não conferem");

			const userFromDB = await app
				.db("users")
				.where({
					email: user.email,
				})
				.first();
			if (!user.id) {
				notExistsOrError(userFromDB, "Usuário já cadastrado");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		user.password = encryptPassword(req.body.password);
		delete user.confirmPassword;

		if (user.id) {
			app
				.db("users")
				.update(user)
				.whereNull("deleted_at")
				.where({
					id: user.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("users")
				.insert(user)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("users")
			.whereNull("deleted_at")
			.select("id", "name", "email", "admin", "deleted_at")
			.then((users) => res.json(users))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("users")
			.whereNull("deleted_at")
			.where({
				id: req.params.id,
			})
			.select("id", "name", "email", "admin")
			.first()
			.then((user) => res.json(user))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsUpdated = await app
				.db("users")
				.update({ deleted_at: new Date() })
				.where("id", req.params.id);

			existsOrError(rowsUpdated, "Usuário não encontrado");

			return res.status(204).send();
		} catch (msg) {
			return res.status(400).send(msg);
		}
	};

	return {
		save,
		get,
		getById,
		remove,
	};
};
