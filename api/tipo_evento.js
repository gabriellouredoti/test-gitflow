module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const tipo_evento = {
			...req.body,
		};

		if (req.params.id) tipo_evento.id = req.params.id;

		try {
			existsOrError(tipo_evento.nome, "Tipo de evento não informado");

			const tipoEventoFromDB = await app
				.db("tipo_evento")
				.where({
					nome: tipo_evento.nome,
				})
				.first();
			if (!tipo_evento.id) {
				notExistsOrError(tipoEventoFromDB, "Tipo de evento já cadastrado");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (tipo_evento.id) {
			app
				.db("tipo_evento")
				.update(tipo_evento)
				.where({
					id: tipo_evento.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("tipo_evento")
				.insert(tipo_evento)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("tipo_evento")
			.select("id", "nome")
			.then((tipo_evento) => res.json(tipo_evento))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("tipo_evento")
			.where({
				id: req.params.id,
			})
			.select("id", "nome")
			.first()
			.then((tipo_evento) => res.json(tipo_evento))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("tipo_evento")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Tipo evento não encontrado");

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
