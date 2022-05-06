module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const regiao = {
			...req.body,
		};

		if (req.params.id) regiao.id = req.params.id;

		try {
			existsOrError(regiao.nome, "Região não informada.");

			const regiaoFromDB = await app
				.db("regioes")
				.where({
					nome: regiao.nome,
				})
				.first();
			if (!regiao.id) {
				notExistsOrError(regiaoFromDB, "Região já cadastrada.");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (regiao.id) {
			//Use transaction query regiao update
			try {
				await app.db
					.transaction(async (trx) => {
						await trx("regioes")
							.update({
								nome: regiao.nome,
							})
							.where({
								id: regiao.id,
							});

						await trx("regiao_municipio").del().where({
							regiao_id: regiao.id,
						});

						const fieldInsertMunicipios = regiao.municipios.map((m) => {
							return {
								regiao_id: regiao.id,
								municipio_id: m.id,
							};
						});

						const regiao_municipio = await app
							.db("regiao_municipio")
							.insert(fieldInsertMunicipios)
							.transacting(trx);

						return regiao_municipio;
					})
					.then((regiao) => res.status(204).send())
					.catch((err) => res.status(500).send("" + err));
			} catch (err) {
				return res.status(500).send(err);
			}
		} else {
			//Use transaction query regiao insert
			try {
				await app.db
					.transaction(async (trx) => {
						const regiao_id = await trx("regioes").insert(
							{
								nome: regiao.nome,
							},
							"id"
						);

						const fieldInsertMunicipios = regiao.municipios.map((m) => {
							return {
								regiao_id: regiao_id,
								municipio_id: m.id,
							};
						});

						const regiao_municipio = await trx("regiao_municipio").insert(
							fieldInsertMunicipios
						);

						return regiao_municipio;
					})
					.then((regiao) => {
						return res.status(204).send();
					});
			} catch (err) {
				return res.status(500).send("" + err);
			}
		}
	};

	const get = (req, res) => {
		app
			.db("regioes")
			.select("id", "nome")
			.then((regiao) => res.json(regiao))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("regioes")
			.where({
				id: req.params.id,
			})
			.select("id", "nome")
			.first()
			.then(async (regiao) => {
				const municipios = await app
					.db("regiao_municipio")
					.innerJoin(
						"municipios",
						"regiao_municipio.municipio_id",
						"municipios.id"
					)
					.where("regiao_id", regiao.id)
					.select("municipios.id", "municipios.nome");

				regiao = { ...regiao, municipios: municipios };

				return res.status(200).json(regiao);
			})
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			// Desvincula municipios a regiao
			await app.db("regiao_municipio").del().where("regiao_id", req.params.id);

			const rowsDeleted = await app
				.db("regioes")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Região não encontrada");

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
