module.exports = (app) => {
	// const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const getMetaRegiao = (req, res) => {
		app
			.db("regioes")
			.innerJoin("metas", "metas.regiao_id", "regioes.id")
			.where((builder) => {
				if (req.query.regioes.length > 0) {
					builder.whereIn("metas.regiao_id", req.query.regioes);
				}
			})
			.groupBy("regioes.id")
			.orderBy(3, "desc")
			.select(
				"regioes.nome as label",
				app.db.raw(
					`IFNULL(SUM(metas.qt_meta_votos), 0) || ';' || IFNULL(SUM(metas.qt_meta_votos_2), 0) || ';' || IFNULL(SUM(metas.qt_meta_votos_3), 0) as metas`
				),
				app.db.raw("IFNULL(SUM(metas.qt_meta_votos), 0) as data")
			)
			.then((meta_regiao) => res.json(meta_regiao))
			.catch((err) => res.status(500).json("", err));
	};

	return {
		getMetaRegiao,
	};
};
