module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const metas_municipio = {
			...req.body,
		};

		if (req.params.id) metas_municipio.id = req.params.id;

		// try {
		// 	existsOrError(metas_municipio.nome, "Metas município não informado");

		// 	const metasMunicipioFromDB = await app.db("metas").where({}).first();
		// 	if (!metas_municipio.id) {
		// 		notExistsOrError(metasMunicipioFromDB, "Metas município já cadastrado");
		// 	}
		// } catch (msg) {
		// 	return res.status(400).send(msg);
		// }

		if (metas_municipio.id) {
			await app.db
				.transaction(async (trx) => {
					const metas = await trx("metas")
						.update({
							ano: metas_municipio.ano,
							municipio_id: metas_municipio.municipio_id,
							zona_id: metas_municipio.zona_id,
							bairro_id: metas_municipio.bairro_id,
							qt_eleitorado: metas_municipio.qt_eleitorado || 0,
							previsao_orcamentaria: metas_municipio.previsao_orcamentaria,
							equipe_id: metas_municipio.equipe_id,
							qt_votos: metas_municipio.qt_votos || 0,
							qt_meta_votos: metas_municipio.qt_meta_votos,
							qt_meta_votos_2: metas_municipio.qt_meta_votos_2,
							qt_meta_votos_3: metas_municipio.qt_meta_votos_3,
							regiao_id: metas_municipio.regiao_id,
						})
						.where({
							id: metas_municipio.id,
						});

					if (metas_municipio.meta_subgrupo.length > 0) {
						console.log("caiu edicao metas sub");

						await trx("metas_subgrupos")
							.del()
							.where("meta_id", metas_municipio.id);

						const metas_subgrupos = metas_municipio.meta_subgrupo.map((ms) => {
							return {
								nome: ms.nome,
								meta_id: meta_id[0],
								pessoa_id: ms.pessoa_id,
								bairro_id: metas_municipio.bairro_id,
								qt_meta_votos: ms.qt_meta_votos,
								qt_meta_votos_2: ms.qt_meta_votos_2,
								qt_meta_votos_3: ms.qt_meta_votos_3,
								previsao_orcamentaria: ms.previsao_orcamentaria,
							};
						});

						await trx("metas_subgrupos").insert(metas_subgrupos);
					}

					return metas;
				})
				.then((metas) => res.status(204).send())
				.catch((err) => res.status(500).send("" + err));
		} else {
			try {
				await app.db
					.transaction(async (trx) => {
						const meta_id = await trx("metas").insert(
							{
								ano: metas_municipio.ano,
								municipio_id: metas_municipio.municipio_id,
								zona_id: metas_municipio.zona_id,
								bairro_id: metas_municipio.bairro_id,
								qt_eleitorado: metas_municipio.qt_eleitorado,
								previsao_orcamentaria: metas_municipio.previsao_orcamentaria,
								equipe_id: metas_municipio.equipe_id,
								qt_votos: metas_municipio.qt_votos,
								qt_meta_votos: metas_municipio.qt_meta_votos,
								qt_meta_votos_2: metas_municipio.qt_meta_votos_2,
								qt_meta_votos_3: metas_municipio.qt_meta_votos_3,
								regiao_id: metas_municipio.regiao_id,
							},
							"id"
						);

						if (metas_municipio.meta_subgrupo.length > 0) {
							const metas_subgrupos = metas_municipio.meta_subgrupo.map(
								(ms) => {
									return {
										nome: ms.nome,
										meta_id: meta_id[0],
										pessoa_id: ms.pessoa_id,
										bairro_id: metas_municipio.bairro_id,
										qt_meta_votos: ms.qt_meta_votos,
										qt_meta_votos_2: ms.qt_meta_votos_2,
										qt_meta_votos_3: ms.qt_meta_votos_3,
										previsao_orcamentaria: ms.previsao_orcamentaria,
									};
								}
							);

							await trx("metas_subgrupos").insert(metas_subgrupos);
						}
						return meta_id;
					})
					.then((metas) => res.status(204).send())
					.catch((err) => res.status(500).send("" + err));
			} catch (err) {
				return res.status(500).send(err);
			}
		}
	};

	const get = (req, res) => {
		app
			.db("metas")
			.leftJoin("municipios", "municipios.id", "metas.municipio_id")
			.leftJoin("equipes", "equipes.id", "metas.equipe_id")
			.leftJoin("pessoas", "pessoas.id", "equipes.pessoa_id")
			.leftJoin("bairros", "bairros.id", "metas.bairro_id")
			.leftJoin("zonas", "zonas.id", "metas.zona_id")
			.where("metas.regiao_id", "=", "")
			.select(
				"metas.id",
				"metas.ano",
				"metas.municipio_id",
				"metas.zona_id",
				"metas.bairro_id",
				"metas.qt_eleitorado",
				"metas.previsao_orcamentaria",
				"metas.equipe_id",
				"metas.qt_votos",
				"metas.qt_meta_votos",
				"metas.qt_meta_votos_2",
				"metas.qt_meta_votos_3",
				"metas.regiao_id",
				"equipes.nome as nome_equipe",
				"pessoas.nome as nome_coordenador",
				"municipios.nome as nome_municipio",
				"bairros.nome as nome_bairro",
				"zonas.nome as zona_nome"
			)
			.then(async (metas_municipio) => {
				let metasMunicipios = [];

				for await (const sub of metas_municipio) {
					const meta_subgrupo = await app
						.db("metas_subgrupos")
						.leftJoin("pessoas", "pessoas.id", "metas_subgrupos.pessoa_id")
						.leftJoin("bairros", "bairros.id", "metas_subgrupos.bairro_id")
						.where("meta_id", sub.id)
						.select(
							"metas_subgrupos.id",
							"metas_subgrupos.pessoa_id",
							"metas_subgrupos.meta_id",
							"metas_subgrupos.nome",
							"metas_subgrupos.qt_meta_votos",
							"metas_subgrupos.qt_meta_votos_2",
							"metas_subgrupos.qt_meta_votos_3",
							"metas_subgrupos.previsao_orcamentaria",
							"pessoas.nome as coordenador_nome",
							"bairros.nome as bairro_nome"
						);

					metasMunicipios.push({
						id: sub.id,
						ano: sub.ano,
						municipio_id: sub.municipio_id,
						zona_id: sub.zona_id,
						bairro_id: sub.bairro_id,
						qt_eleitorado: sub.qt_eleitorado,
						previsao_orcamentaria: sub.previsao_orcamentaria,
						equipe_id: sub.equipe_id,
						qt_votos: sub.qt_votos,
						qt_meta_votos: sub.qt_meta_votos,
						qt_meta_votos_2: sub.qt_meta_votos_2,
						qt_meta_votos_3: sub.qt_meta_votos_3,
						regiao_id: sub.regiao_id,
						nome_equipe: sub.nome_equipe,
						nome_coordenador: sub.nome_coordenador,
						nome_municipio: sub.nome_municipio,
						nome_bairro: sub.nome_bairro,
						zona_nome: sub.zona_nome,
						meta_subgrupo: meta_subgrupo,
					});
				}

				return res.json(metasMunicipios);
			})
			.catch((err) => res.status(500).json("", err));
	};

	const getById = (req, res) => {
		app
			.db("metas")
			.leftJoin("municipios", "municipios.id", "metas.municipio_id")
			.leftJoin("equipes", "equipes.id", "metas.equipe_id")
			.leftJoin("pessoas", "pessoas.id", "equipes.pessoa_id")
			.where("metas.regiao_id", "=", "")
			.where("metas.id", req.params.id)
			.first(
				"metas.id",
				"metas.ano",
				"metas.municipio_id",
				"metas.zona_id",
				"metas.bairro_id",
				"metas.qt_eleitorado",
				"metas.previsao_orcamentaria",
				"metas.equipe_id",
				"metas.qt_votos",
				"metas.qt_meta_votos",
				"metas.qt_meta_votos_2",
				"metas.qt_meta_votos_3",
				"metas.regiao_id",
				"equipes.nome as nome_equipe",
				"pessoas.nome as nome_coordenador"
			)
			.then(async (metas_municipio) => {
				const meta_subgrupo = await app
					.db("metas_subgrupos")
					.where("meta_id", req.params.id)
					.select("*");

				return res.json({
					...metas_municipio,
					meta_subgrupo: meta_subgrupo,
				});
			})
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			await app.db("metas_subgrupos").del().where("meta_id", req.params.id);

			const rowsDeleted = await app
				.db("metas")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Metas município não encontrado");

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
