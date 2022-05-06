module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const bairro = {
			...req.body,
		};

		if (req.params.id) bairro.id = req.params.id;

		try {
			existsOrError(bairro.nome, "Bairro não informado");

			const bairroFromDB = await app
				.db("bairros")
				.where({
					nome: bairro.nome,
				})
				.first();
			if (!bairro.id) {
				notExistsOrError(bairroFromDB, "Bairro já cadastrado");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (bairro.id) {
			app
				.db("bairros")
				.update(bairro)
				.where({
					id: bairro.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("bairros")
				.insert(bairro)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("bairros")
			.leftJoin("municipios", "municipios.id", "bairros.municipio_id")
			.select(
				"bairros.id",
				"bairros.nome",
				"bairros.municipio_id",
				"municipios.nome as municipio_nome"
			)
			.then((bairro) => res.json(bairro))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("bairros")
			.where({
				id: req.params.id,
			})
			.select("id", "nome", "municipio_id")
			.first()
			.then((bairro) => res.json(bairro))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("bairros")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Bairro não encontrado");

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
