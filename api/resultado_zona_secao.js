module.exports = (app) => {
	// const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const getResultadoZona = (req, res) => {
		const parsedRequestZonas = JSON.parse(req.query.zonas);

		app
			.db("votacao_resultado")
			.where((builder) => {
				if (parsedRequestZonas.length > 0) {
					const municipios = parsedRequestZonas.map((m) => m.municipio);
					const zonas = parsedRequestZonas.map((z) => z.zona);
					builder.whereIn("municipio", municipios);
					builder.whereIn("zona", zonas);
				}
			})
			.groupBy("votacao_resultado.zona")
			.groupBy("votacao_resultado.municipio")
			.orderBy(2, "desc")
			.select(
				app.db.raw("zona || 'ª' || ' - ' || municipio as label"),
				app.db.raw("IFNULL(SUM(votacao_resultado.qt_votos), 0) as data")
			)
			.then((zona) => res.json(zona))
			.catch((err) => res.status(500).send(err));
	};

	const getResultadoSecao = (req, res) => {
		const parsedRequestSecao = JSON.parse(req.query.secao);

		app
			.db("votacao_resultado")
			.where((builder) => {
				if (parsedRequestSecao.length > 0) {
					const zonas = parsedRequestSecao.map((z) => z.zona);
					const secoes = parsedRequestSecao.map((m) => m.secao);
					builder.whereIn("votacao_resultado.zona", zonas);
					builder.whereIn("votacao_resultado.secao", secoes);
				}
			})
			.groupBy("votacao_resultado.escola")
			.groupBy("votacao_resultado.secao")
			.orderBy(2, "desc")
			.select(
				app.db.raw(
					`votacao_resultado.zona || 'ª' ||  ' - '  || votacao_resultado.municipio || ' - ' || votacao_resultado.secao || ' - ' || votacao_resultado.escola as label`
				),
				app.db.raw("IFNULL(SUM(votacao_resultado.qt_votos), 0) as data")
			)
			.then((zona) => res.json(zona))
			.catch((err) => res.status(500).send(err));
	};

	return {
		getResultadoZona,
		getResultadoSecao,
	};
};
