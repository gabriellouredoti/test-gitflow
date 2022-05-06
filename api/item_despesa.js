module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const tipo_despesa = {
			...req.body,
		};

		if (req.params.id) tipo_despesa.id = req.params.id;

		try {
			existsOrError(tipo_despesa.nome, "Tipo de despesa não informado");

			const tipoDespesaFromDB = await app
				.db("tipo_despesa")
				.where({
					nome: tipo_despesa.nome,
				})
				.first();
			if (!tipo_despesa.id) {
				notExistsOrError(tipoDespesaFromDB, "Tipo de Despesa já cadastrado");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (tipo_despesa.id) {
			app
				.db("tipo_despesa")
				.update(tipo_despesa)
				.where({
					id: tipo_despesa.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("tipo_despesa")
				.insert(tipo_despesa)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("tipo_despesa")
			.select("id", "nome")
			.then((tipo_despesa) => res.json(tipo_despesa))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("tipo_despesa")
			.where({
				id: req.params.id,
			})
			.select("id", "nome")
			.first()
			.then((tipo_despesa) => res.json(tipo_despesa))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("tipo_despesa")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Tipo de Despesa não encontrado");

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
