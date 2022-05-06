module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const { entradaCalculo, entradaCalculoById } = require("../api/queries");

	const save = async (req, res) => {
		const entrada = {
			...req.body,
		};

		if (req.params.id) entrada.id = req.params.id;

		try {
			existsOrError(entrada.receita, "Entrada não informada");

			const entradaFromDB = await app
				.db("entradas")
				.where({
					receita: entrada.receita,
				})
				.first();
			if (!entrada.id) {
				notExistsOrError(entradaFromDB, "Entrada já cadastrada");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (entrada.id) {
			app
				.db("entradas")
				.update(entrada)
				.where({
					id: entrada.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("entradas")
				.insert(entrada)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app.db
			.raw(entradaCalculo)
			.then((entrada) => res.json(entrada))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app.db
			.raw(entradaCalculoById, req.params.id)
			.then((entrada) => res.json(entrada[0]))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("entradas")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Entrada não encontrada");

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
