module.exports = (app) => {
	// const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const getMetasSubgrupos = (req, res) => {
		app
			.db("metas_subgrupos")
			.where((builder) => {
				if (req.query.metas_subgrupos) {
					builder.whereIn("metas_subgrupos.id", req.query.metas_subgrupos);
				}
			})
			.groupBy("metas_subgrupos.id")
			.orderBy(2, "desc")
			.select(
				"metas_subgrupos.nome as label",
				app.db.raw("sum(metas_subgrupos.qt_meta_votos) as data"),
				app.db.raw(
					`IFNULL(SUM(metas_subgrupos.qt_meta_votos), 0) || ';' || IFNULL(SUM(metas_subgrupos.qt_meta_votos_2), 0) || ';' || IFNULL(SUM(metas_subgrupos.qt_meta_votos_3), 0) as metas_subgrupos`
				)
			)
			.then((metas_subgrupos) => res.json(metas_subgrupos))
			.catch((err) => res.status(500).send(err));
	};

	return {
		getMetasSubgrupos,
	};
};
