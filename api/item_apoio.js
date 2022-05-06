module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const item_apoio = {
			...req.body,
		};

		if (req.params.id) item_apoio.id = req.params.id;

		try {
			existsOrError(item_apoio.nome, "Item de apoio não informado");

			const item_apoioFromDB = await app
				.db("item_apoio")
				.where({
					nome: item_apoio.nome,
				})
				.first();
			if (!item_apoio.id) {
				notExistsOrError(item_apoioFromDB, "Item de apoio já cadastrado");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (item_apoio.id) {
			app
				.db("item_apoio")
				.update(item_apoio)
				.where({
					id: item_apoio.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("item_apoio")
				.insert(item_apoio)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("item_apoio")
			.select("id", "nome")
			.then((item_apoio) => res.json(item_apoio))
			.catch((err) => res.status(500).send(err));
	};

	const getSocket = async () => {
		try {
			const teste = await app.db("item_apoio").select("id", "nome");

			return teste;
		} catch (error) {}
	};

	const getById = (req, res) => {
		app
			.db("item_apoio")
			.where({
				id: req.params.id,
			})
			.select("id", "nome")
			.first()
			.then((item_apoio) => res.json(item_apoio))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("item_apoio")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Item de apoio não encontrado");

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
		getSocket,
	};
};
