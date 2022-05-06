module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		let pessoa = {
			...req.body,
		};

		if (req.params.id) pessoa.id = req.params.id;

		try {
			existsOrError(pessoa.nome, "Candato não informado");

			const pessoaFromDB = await app
				.db("pessoas")
				.where({
					nome: pessoa.nome,
					tipo: 2,
				})
				.first();
			if (!pessoa.id) {
				notExistsOrError(pessoaFromDB, "Candidato já cadastrado");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (pessoa.id) {
			app
				.db("pessoas")
				.update(pessoa)
				.where({
					id: pessoa.id,
					tipo: 2,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			pessoa = { ...pessoa, tipo: 2 };
			app
				.db("pessoas")
				.insert(pessoa)
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("pessoas")
			.where("tipo", 2)
			.select("id", "nome", "codigo", "tipo")
			.then((pessoa) => res.json(pessoa))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("pessoas")
			.where({
				id: req.params.id,
				tipo: 2,
			})
			.select("id", "nome", "codigo", "tipo")
			.first()
			.then((pessoa) => res.json(pessoa))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("pessoas")
				.del()
				.where("id", req.params.id)
				.where("tipo", 2);

			existsOrError(rowsDeleted, "Candidato não encontrado");

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
