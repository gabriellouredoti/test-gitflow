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
			app
				.db("metas")
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
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send(err));
		} else {
			app
				.db("metas")
				.insert({
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
				})
				.then((_) => {
					res.status(204).send();
				})
				.catch((err) => res.status(500).send("" + err));
		}
	};

	const get = (req, res) => {
		app
			.db("metas")
			.leftJoin("municipios", "municipios.id", "metas.municipio_id")
			.leftJoin("regioes", "regioes.id", "metas.regiao_id")
			.leftJoin("equipes", "equipes.id", "metas.equipe_id")
			.leftJoin("pessoas", "pessoas.id", "equipes.pessoa_id")
			.where("metas.regiao_id", "!=", "")
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
				"regioes.nome as nome_regiao",
				app.db.raw(`
          (SELECT group_concat(nome, "\n")
            FROM regiao_municipio rm
            LEFT JOIN municipios m ON m.id = rm.municipio_id 
            WHERE rm.regiao_id = regioes.id
          ) as municipios`)
			)
			.then((metas_municipio) => res.json(metas_municipio))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("metas")
			.leftJoin("municipios", "municipios.id", "metas.municipio_id")
			.leftJoin("regioes", "regioes.id", "metas.regiao_id")
			.leftJoin("equipes", "equipes.id", "metas.equipe_id")
			.leftJoin("pessoas", "pessoas.id", "equipes.pessoa_id")
			.where("metas.regiao_id", "!=", "")
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
				"pessoas.nome as nome_coordenador",
				"regioes.nome as nome_regiao"
			)
			.then((metas_municipio) => res.json(metas_municipio))
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
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
