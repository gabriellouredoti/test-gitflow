module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		let pessoa = {
			...req.body,
		};

		if (req.params.id) pessoa.id = req.params.id;

		try {
			existsOrError(pessoa.nome, "Pessoa não informada");

			const pessoaFromDB = await app
				.db("pessoas")
				.where({
					nome: pessoa.nome,
					tipo: 1,
				})
				.first();
			if (!pessoa.id) {
				notExistsOrError(pessoaFromDB, "Pessoa já cadastrada");
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
					tipo: 1,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			pessoa = { ...pessoa, tipo: 1 };

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
			.leftJoin("municipios", "municipios.id", "pessoas.municipio_id")
			.leftJoin(
				"tipo_coordenador",
				"tipo_coordenador.id",
				"pessoas.tipo_coordenador_id"
			)
			.select(
				"pessoas.id",
				"pessoas.nome",
				"pessoas.codigo",
				"pessoas.tipo",
				"pessoas.municipio_id",
				"pessoas.tipo_coordenador_id",
				"municipios.nome as municipio_nome",
				"tipo_coordenador.nome as tipo_coordenador_nome"
			)
			.where("tipo", 1)
			.then((pessoa) => res.json(pessoa))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("pessoas")
			.where({
				id: req.params.id,
				tipo: 1,
			})
			.select(
				"id",
				"nome",
				"codigo",
				"tipo",
				"municipio_id",
				"tipo_coordenador_id"
			)
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
				.where("tipo", 1);

			existsOrError(rowsDeleted, "Pessoa não encontrada");

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
