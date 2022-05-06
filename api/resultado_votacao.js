module.exports = (app) => {
	// const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const getResultadoRegiao = (req, res) => {
		app
			.db("regioes")
			.innerJoin("regiao_municipio", "regiao_municipio.regiao_id", "regioes.id")
			.innerJoin("municipios", "municipios.id", "regiao_municipio.municipio_id")
			.where((builder) => {
				if (req.query.regioes.length > 0) {
					builder.whereIn("regioes.id", req.query.regioes);
				}
			})
			.groupBy("regioes.id")
			.orderBy(2, "desc")
			.select(
				"regioes.nome as label",
				app.db.raw(
					"IFNULL(SUM((SELECT IFNULL(sum(qt_votos), 0) FROM votacao_resultado vr WHERE municipio  = municipios.nome)), 0) as data"
				)
			)
			.then((regiao) => res.json(regiao))
			.catch((err) => res.status(500).send(err));
	};

	const getResultadoMunicipio = (req, res) => {
		app
			.db("regioes")
			.innerJoin("regiao_municipio", "regiao_municipio.regiao_id", "regioes.id")
			.innerJoin("municipios", "municipios.id", "regiao_municipio.municipio_id")
			.where((builder) => {
				if (req.query.municipios.length > 0) {
					builder.whereIn("municipios.id", req.query.municipios);
				}
			})
			.groupBy("municipios.id")
			.orderBy(2, "desc")
			.select(
				app.db.raw("regioes.nome || ' - ' || municipios.nome as label"),
				app.db.raw(
					"IFNULL((SELECT sum(vr.qt_votos) FROM votacao_resultado vr WHERE vr.municipio = municipios.nome), 0) as data"
				)
			)
			.then((municipios) => res.json(municipios))
			.catch((err) => res.status(500).json("", err));
	};

	const getResultadoBairro = (req, res) => {
		app
			.db("bairros")
			.innerJoin("municipios", "municipios.id", "bairros.municipio_id")
			.innerJoin(
				"regiao_municipio",
				"regiao_municipio.municipio_id",
				"municipios.id"
			)
			.innerJoin("regioes", "regioes.id", "regiao_municipio.regiao_id")
			.where((builder) => {
				if (req.query.bairros.length > 0) {
					builder.whereIn("bairros.id", req.query.bairros);
				}
			})
			.orderBy(3, "desc")
			.select(
				"bairros.nome",
				app.db.raw(
					"regioes.nome || ' - ' || municipios.nome || ' - ' || bairros.nome as label"
				),
				app.db.raw(
					"IFNULL((SELECT SUM(qt_votos) FROM votacao_resultado vr WHERE vr.bairro = bairros.nome and vr.municipio = municipios.nome GROUP BY vr.bairro), 0 ) as data"
				)
			)
			.then((bairros) => res.json(bairros))
			.catch((err) => res.status(500).send(err));
	};

	return {
		getResultadoRegiao,
		getResultadoMunicipio,
		getResultadoBairro,
	};
};
