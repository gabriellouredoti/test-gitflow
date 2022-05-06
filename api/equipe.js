module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const equipe = {
			...req.body,
		};

		if (req.params.id) equipe.id = req.params.id;

		try {
			existsOrError(equipe.nome, "Equipe não informada");

			const equipeFromDB = await app
				.db("equipes")
				.where({
					nome: equipe.nome,
				})
				.first();
			if (!equipe.id) {
				notExistsOrError(equipeFromDB, "Equipe já cadastrada");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (equipe.id) {
			console.log(equipe);
			app
				.db("equipes")
				.update({
					pessoa_id: equipe.pessoa_id,
					municipio_id: equipe.municipio_id,
					nome: equipe.nome,
				})
				.where({
					id: equipe.id,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("equipes")
				.insert({
					pessoa_id: equipe.pessoa_id,
					municipio_id: equipe.municipio_id,
					nome: equipe.nome,
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		}
	};

	const get = (req, res) => {
		app
			.db("equipes")
			.leftJoin("pessoas", "pessoas.id", "equipes.pessoa_id")
			.leftJoin("municipios", "municipios.id", "equipes.municipio_id")
			.select(
				"equipes.id",
				"equipes.nome",
				"equipes.pessoa_id",
				"equipes.municipio_id",
				"pessoas.nome as nome_coordenador",
				"municipios.nome as nome_municipio"
			)
			.then((equipe) => res.json(equipe))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("equipes")
			.leftJoin("pessoas", "pessoas.id", "equipes.pessoa_id")
			.leftJoin("municipios", "municipios.id", "equipes.municipio_id")
			.where("equipes.id", req.params.id)
			.first(
				"equipes.id",
				"equipes.nome",
				"equipes.pessoa_id",
				"equipes.municipio_id",
				"pessoas.nome as nome_coordenador",
				"municipios.nome as nome_municipio"
			)
			.then((equipe) => res.json(equipe))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			const rowsDeleted = await app
				.db("equipes")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Equipe não encontrada");

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
