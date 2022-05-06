module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const zona = {
			...req.body,
		};

		if (req.params.id) zona.id = req.params.id;

		try {
			existsOrError(zona.nome, "Zona não informada");

			const zonaFromDB = await app
				.db("zonas")
				.where({
					nome: zona.nome,
				})
				.first();
			if (!zona.id) {
				notExistsOrError(zonaFromDB, "Zona já cadastrada");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (zona.id) {
			app
				.db("zonas")
				.update(zona)
				.where({
					id: zona.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("zonas")
				.insert(zona)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("zonas")
			.select("id", "nome")
			.then((zona) => res.json(zona))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("zonas")
			.where({
				id: req.params.id,
			})
			.select("id", "nome")
			.first()
			.then((zona) => res.json(zona))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("zonas")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Zona não encontrada");

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
