module.exports = (app) => {
	const { existsOrError, notExistsOrError } = app.api.validation;

	const save = async (req, res) => {
		const municipio = {
			...req.body,
		};

		if (req.params.id) municipio.id = req.params.id;

		try {
			existsOrError(municipio.nome, "Município não informado");

			const municipioFromDB = await app
				.db("municipios")
				.where({
					nome: municipio.nome,
				})
				.first();
			if (!municipio.id) {
				notExistsOrError(municipioFromDB, "Município já cadastrado");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (municipio.id) {
			app
				.db("municipios")
				.update(municipio)
				.where({
					id: municipio.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("municipios")
				.insert(municipio)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("municipios")
			.select("id", "nome", "codigo")
			.then((municipio) => res.json(municipio))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("municipios")
			.where({
				id: req.params.id,
			})
			.select("id", "nome", "codigo")
			.first()
			.then((municipio) => res.json(municipio))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("municipios")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Município não encontrado");

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
