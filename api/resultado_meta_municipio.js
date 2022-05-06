module.exports = (app) => {
	// const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const getMetaMunicipio = (req, res) => {
		app
			.db("metas")
			.leftJoin("municipios", "municipios.id", "metas.municipio_id")
			.where((builder) => {
				if (
					req.query.municipios != undefined &&
					req.query.municipios.length > 0
				) {
					builder.whereIn("metas.municipio_id", req.query.municipios);
				}
			})
			.groupBy("metas.municipio_id")
			.orderBy(2, "desc")
			.select(
				"municipios.nome as label",
				app.db.raw("sum(metas.qt_meta_votos) as data"),
				app.db.raw(
					`IFNULL(SUM(metas.qt_meta_votos), 0) || ';' || IFNULL(SUM(metas.qt_meta_votos_2), 0) || ';' || IFNULL(SUM(metas.qt_meta_votos_3), 0) as metas`
				)
			)
			.then((metas_municipio) => res.json(metas_municipio))
			.catch((err) => res.status(500).send(err));
	};

	const getMetaEquipe = (req, res) => {
		app
			.db("metas")
			.leftJoin("equipes", "metas.equipe_id", "equipes.id")
			.leftJoin("municipios", "municipios.id", "metas.municipio_id")
			.leftJoin("bairros", "bairros.id", "metas.bairro_id")
			.where((builder) => {
				if (req.query.equipes.length > 0) {
					builder.whereIn("metas.equipe_id", req.query.equipes);
					builder.where("metas.regiao_id", "=", "");
				}
			})
			.groupBy("metas.equipe_id")
			.orderBy("metas.qt_meta_votos", "desc")
			.select(
				app.db.raw(
					"municipios.nome || ' - ' || ifnull(bairros.nome, '') || ' - ' || equipes.nome as label"
				),
				app.db.raw(
					"sum(metas.qt_meta_votos) || ';' || sum(metas.qt_meta_votos_2) || ';' || sum(metas.qt_meta_votos_3) as metas"
				),
				app.db.raw("sum(metas.qt_meta_votos) as data")
			)
			.then((metas_municipio) => res.json(metas_municipio))
			.catch((err) => res.status(500).send(err));
	};

	return {
		getMetaMunicipio,
		getMetaEquipe,
	};
};
