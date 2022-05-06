module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const tipo_coordenador = {
			...req.body,
		};

		if (req.params.id) tipo_coordenador.id = req.params.id;

		try {
			existsOrError(tipo_coordenador.nome, "Tipo de coordenador não informado");

			const tipoCoordenadorFromDB = await app
				.db("tipo_coordenador")
				.where({
					nome: tipo_coordenador.nome,
				})
				.first("tipo_coordenador.id", "tipo_coordenador.nome");
			if (!tipo_coordenador.id) {
				notExistsOrError(
					tipoCoordenadorFromDB,
					"Tipo de coordenador já cadastrado"
				);
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (tipo_coordenador.id) {
			app
				.db("tipo_coordenador")
				.update(tipo_coordenador)
				.where({
					id: tipo_coordenador.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("tipo_coordenador")
				.insert(tipo_coordenador)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("tipo_coordenador")
			.select("tipo_coordenador.id", "tipo_coordenador.nome")
			.then((tipo_coordenador) => res.json(tipo_coordenador))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("tipo_coordenador")
			.where({
				id: req.params.id,
			})
			.first("tipo_coordenador.id", "tipo_coordenador.nome")
			.then((tipo_coordenador) => res.json(tipo_coordenador))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("tipo_coordenador")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Tipo de coordenador não encontrado");

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
