module.exports = (app) => {
	const { entradaCalculo } = require("../api/queries");

	const getMunicipios = (req, res) => {
		app
			.db("municipios")
			.where((builder) => {
				if (req.params.regiao_id) {
					const subselect = app
						.db("regiao_municipio")
						.where("regiao_id", req.params.regiao_id)
						.select("municipio_id");
					builder.whereIn("id", subselect);
				}
				if (req.query.regioes) {
					const subselect = app
						.db("regiao_municipio")
						.whereIn("regiao_id", req.query.regioes)
						.select("municipio_id");
					builder.whereIn("id", subselect);
				}
			})
			.select("id", "nome")
			.then((municipio) => res.json(municipio))
			.catch((err) => res.status(500).send(err));
	};

	const getCoordenadores = (req, res) => {
		app
			.db("pessoas")
			.where("tipo", 1)
			.select("id", "nome")
			.then((coordenador) => res.json(coordenador))
			.catch((err) => res.status(500).send(err));
	};

	const getItemApoio = (req, res) => {
		app
			.db("item_apoio")
			.select("id", "nome")
			.then((item_apoio) => res.json(item_apoio))
			.catch((err) => res.status(500).send(err));
	};

	const getTipoEvento = (req, res) => {
		app
			.db("tipo_evento")
			.select("id", "nome")
			.then((tipo_evento) => res.json(tipo_evento))
			.catch((err) => res.status(500).send(err));
	};

	const getEntradas = (req, res) => {
		app.db
			.raw(entradaCalculo)
			.then((entradas) => res.json(entradas))
			.catch((err) => res.status(500).send(err));
	};

	const getTipoDespesa = (req, res) => {
		app
			.db("tipo_despesa")
			.select("id", "nome")
			.then((tipo_despesa) => res.json(tipo_despesa))
			.catch((err) => res.status(500).send(err));
	};

	const getTipoCoordenador = (req, res) => {
		app
			.db("tipo_coordenador")
			.select("id", "nome")
			.then((tipo_despesa) => res.json(tipo_despesa))
			.catch((err) => res.status(500).send(err));
	};

	const getRegioes = (req, res) => {
		app
			.db("regioes")
			.select("id", "nome")
			.then((regioes) => res.json(regioes))
			.catch((err) => res.status(500).send(err));
	};

	const getEquipes = (req, res) => {
		app
			.db("equipes")
			.where((builder) => {
				if (req.query.municipios) {
					const parseValuesMunicipio = JSON.parse(req.query.municipios);
					const municipios = parseValuesMunicipio.map((m) => m.id);
					builder.whereIn("municipio_id", municipios);
				}
				if (req.query.array_municipios) {
					builder.whereIn("municipio_id", req.query.array_municipios);
				}
			})
			.select("id", "nome")
			.then((equipes) => res.json(equipes))
			.catch((err) => res.status(500).send(err));
	};

	const getBairros = (req, res) => {
		app
			.db("bairros")
			.leftJoin("municipios", "municipios.id", "bairros.municipio_id")
			.where((builder) => {
				if (req.params.municipio_id) {
					builder.where("bairros.municipio_id", req.params.municipio_id);
				}
				if (req.query.municipios) {
					builder.whereIn("bairros.municipio_id", req.query.municipios);
				}
			})
			.orderBy("municipios.nome", "asc")
			.orderBy("bairros.nome", "asc")
			.select(
				"bairros.id",
				"bairros.nome",
				"bairros.municipio_id",
				app.db.raw("municipios.nome || ' - ' || bairros.nome as bairro_nome")
			)
			.then((bairros) => res.json(bairros))
			.catch((_) => {});
	};

	const getZonas = (req, res) => {
		app
			.db("zonas")
			.select("id", "nome")
			.then((zonas) => res.json(zonas))
			.catch((_) => {});
	};

	const getZonasEleitorais = (req, res) => {
		app
			.db("estatistica_eleitorado")
			.orderBy("municipio", "asc")
			.select(
				"id",
				"municipio",
				"zona",
				app.db.raw("zona || 'ª' || ' - ' || municipio as nome")
			)
			.then((zonas_eleitorais) => res.json(zonas_eleitorais))
			.catch((err) => res.status(500).send(err));
	};

	const getSecoesEleitorais = (req, res) => {
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
			.select(
				"id",
				"zona",
				"secao",
				"escola",
				app.db.raw(
					"zona || 'ª' || ' - ' || municipio || ' - ' || secao || ' - ' || escola as nome"
				)
			)
			.then((secao) => res.json(secao))
			.catch((err) => res.status(500).json("", err));
	};

	const getVotosRegiao = (req, res) => {
		app
			.db("regioes")
			.innerJoin("regiao_municipio", "regiao_municipio.regiao_id", "regioes.id")
			.innerJoin("municipios", "municipios.id", "regiao_municipio.municipio_id")
			.where((builder) => {
				if (req.query.regioes != undefined) {
					builder.whereIn("regioes.id", req.query.regioes);
				}
			})
			.groupBy("regioes.id")
			.select(
				"regioes.nome",
				app.db.raw(
					"IFNULL(SUM((SELECT IFNULL(sum(vr.qt_votos), 0) FROM votacao_resultado vr WHERE vr.municipio = municipios.nome)), 0) as qt_votos"
				)
			)
			.then((regioes) => res.json(regioes))
			.catch((err) => res.status(500).json("", err));
	};

	const getVotosRegiaoMunicipio = (req, res) => {
		app
			.db("regioes")
			.innerJoin("regiao_municipio", "regiao_municipio.regiao_id", "regioes.id")
			.innerJoin("municipios", "municipios.id", "regiao_municipio.municipio_id")
			.where((builder) => {
				if (req.query.regioes != undefined) {
					builder.whereIn("regioes.id", req.query.regioes);
				}
			})
			.groupBy("municipios.nome")
			.orderBy(2, "desc")
			.select(
				"municipios.nome",
				app.db.raw(
					"IFNULL(SUM((SELECT SUM(vr.qt_votos) FROM votacao_resultado vr WHERE vr.municipio = municipios.nome)),0) as qt_votos"
				)
			)
			.then((municipios) => res.json(municipios))
			.catch((err) => res.status(500).send(err));
	};

	const getVotosMunicipio = async (req, res) => {
		let municipios = await app
			.db("municipios")
			.whereIn("municipios.id", req.query.municipios)
			.select("municipios.nome");

		let filteredMunicipios = [];

		for (const municipio of municipios) {
			filteredMunicipios.push(municipio.nome);
		}

		app
			.db("votacao_resultado")
			.where((builder) => {
				if (filteredMunicipios.length > 0) {
					builder.whereIn("votacao_resultado.municipio", filteredMunicipios);
				}
			})
			.groupBy("votacao_resultado.municipio")
			.orderBy(2, "desc")
			.select(
				"votacao_resultado.municipio as nome",
				app.db.raw("IFNULL(SUM(votacao_resultado.qt_votos), 0) as qt_votos")
			)
			.then((votos_municipio) => res.json(votos_municipio))
			.catch((err) => res.status(500).send(err));
	};

	const getVotosMunicipioBairro = async (req, res) => {
		let bairros = await app
			.db("bairros")
			.whereIn("bairros.id", req.query.bairros)
			.select("bairros.nome");

		let filteredBairros = [];

		for (const bairro of bairros) {
			filteredBairros.push(bairro.nome);
		}

		app
			.db("votacao_resultado")
			.where((builder) => {
				if (filteredBairros.length > 0) {
					builder.whereIn("votacao_resultado.bairro", filteredBairros);
				}
			})
			.groupBy("votacao_resultado.bairro")
			.orderBy(2, "desc")
			.select(
				app.db.raw(
					"votacao_resultado.municipio || ' - ' || votacao_resultado.bairro as nome"
				),
				app.db.raw("IFNULL(SUM(votacao_resultado.qt_votos), 0) as qt_votos")
			)
			.then((votacao_bairro) => res.json(votacao_bairro))
			.catch((err) => res.status(500).send(err));
	};

	const getMetasSubgrupos = (req, res) => {
		app
			.db("metas_subgrupos")
			.where((builder) => {
				if (req.query.bairros) {
					builder.whereIn("bairro_id", bairros);
				}
			})
			.select("id", "nome")
			.then((metas_subgrupos) => res.json(metas_subgrupos))
			.catch((err) => res.status(500).send(err));
	};

	return {
		getMunicipios,
		getCoordenadores,
		getItemApoio,
		getTipoEvento,
		getEntradas,
		getTipoDespesa,
		getRegioes,
		getEquipes,
		getBairros,
		getZonas,
		getZonasEleitorais,
		getSecoesEleitorais,
		getVotosRegiao,
		getVotosRegiaoMunicipio,
		getVotosMunicipio,
		getVotosMunicipioBairro,
		getMetasSubgrupos,
		getTipoCoordenador,
	};
};
