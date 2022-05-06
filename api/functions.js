module.exports = (app) => {
	// const { regiaoCalculoVotos, regiaoCalculoEleitorados } = require("./queries");

	const getCalculoRegiaoVotos = (req, res) => {
		app
			.db("regioes")
			.innerJoin("regiao_municipio", "regiao_municipio.regiao_id", "regioes.id")
			.innerJoin("municipios", "municipios.id", "regiao_municipio.municipio_id")
			.where((builder) => {
				if (req.params.regiao_id != undefined) {
					builder.where("regioes.id", req.params.regiao_id);
				}
				if (req.query.regioes != undefined) {
					builder.whereIn("regioes.id", req.query.regioes);
				}
			})
			.select(
				app.db.raw(
					"IFNULL(sum((SELECT sum(qt_votos) FROM votacao_resultado vr WHERE municipio = municipios.nome)), 0) as qt_votos"
				)
			)
			.then((regiao) => res.json(regiao))
			.catch((err) => res.status(500).send(err));
	};

	const getCalculoRegiaoEleitorados = (req, res) => {
		const subquery = app
			.db("regioes")
			.innerJoin("regiao_municipio", "regiao_municipio.regiao_id", "regioes.id")
			.innerJoin("municipios", "municipios.id", "regiao_municipio.municipio_id")
			.where((builder) => {
				if (req.params.regiao_id != undefined) {
					builder.where("regioes.id", req.params.regiao_id);
				}
				if (req.query.regioes != undefined) {
					builder.whereIn("regioes.id", req.query.regioes);
				}
			})
			.select("municipios.nome");

		app
			.db("estatistica_eleitorado")
			.whereIn("estatistica_eleitorado.municipio", subquery)
			.select(
				app.db.raw(
					"IFNULL(sum(estatistica_eleitorado.qt_eleitorado), 0) as qt_eleitorado"
				)
			)
			.then((regiao) => res.json(regiao))
			.catch((err) => res.status(500).send(err));
	};

	const getCalculoMunicipioVotos = async (req, res) => {
		let municipio = [];
		let filteredMunicipios = [];

		if (req.params.municipio_id != undefined) {
			municipio = await app
				.db("municipios")
				.where("municipios.id", req.params.municipio_id)
				.first();
		}

		if (req.query.municipios != undefined) {
			municipio = await app
				.db("municipios")
				.whereIn("municipios.id", req.query.municipios)
				.select("municipios.nome");

			for (const mun of municipio) {
				filteredMunicipios.push(mun.nome);
			}
		}

		app
			.db("votacao_resultado")
			.where((builder) => {
				if (
					req.params.municipio_id != undefined &&
					(municipio.nome != "" || municipio.nome != undefined)
				) {
					builder.where("municipio", municipio.nome);
				}
				if (
					req.query.municipios != undefined &&
					filteredMunicipios.length > 0
				) {
					builder.whereIn("municipio", filteredMunicipios);
				}
			})
			.sum("qt_votos as qt_votos")
			.first()
			.then((municipios) => res.json(municipios))
			.catch((err) => res.status(500).send(err));
	};

	const getCalculoMunicipioEleitorados = async (req, res) => {
		let municipio = [];
		let filteredMunicipios = [];

		if (req.params.municipio_id != undefined) {
			municipio = await app
				.db("municipios")
				.where("municipios.id", req.params.municipio_id)
				.first();
		}

		if (req.query.municipios != undefined) {
			municipio = await app
				.db("municipios")
				.whereIn("municipios.id", req.query.municipios)
				.select("municipios.nome");

			for (const mun of municipio) {
				filteredMunicipios.push(mun.nome);
			}
		}

		app
			.db("estatistica_eleitorado")
			.where((builder) => {
				if (
					req.params.municipio_id != undefined &&
					(municipio.nome != "" || municipio.nome != undefined)
				) {
					builder.where("estatistica_eleitorado.municipio", municipio.nome);
				}
				if (
					req.query.municipios != undefined &&
					filteredMunicipios.length > 0
				) {
					builder.whereIn(
						"estatistica_eleitorado.municipio",
						filteredMunicipios
					);
				}
			})
			.sum("estatistica_eleitorado.qt_eleitorado as qt_eleitorado")
			.first()
			.then((municipios) => res.json(municipios))
			.catch((err) => res.status(500).send(err));
	};

	const getCalculoBairrosVotos = async (req, res) => {
		const municipio = await app
			.db("municipios")
			.where("id", req.params.municipio_id)
			.first();

		const bairro = await app
			.db("bairros")
			.where("id", req.params.bairro_id)
			.first();

		app
			.db("votacao_resultado")
			.where((builder) => {
				if (
					(municipio.nome != "" || municipio.nome != undefined) &&
					(bairro.nome != "" || bairro.nome != undefined)
				) {
					builder.where("municipio", "=", municipio.nome);
					builder.where("bairro", "=", bairro.nome);
				}
			})
			.sum("qt_votos as qt_votos")
			.first()
			.then((bairros) => res.json(bairros))
			.catch((_) => {});
	};

	const getCalculoBairrosEleitorados = async (req, res) => {
		const municipio = await app
			.db("municipios")
			.where("id", req.params.municipio_id)
			.first();

		app
			.db("estatistica_eleitorado")
			.where((builder) => {
				if (municipio.nome != "" || municipio.nome != undefined) {
					builder.where("municipio", municipio.nome);
				}
			})
			.sum("qt_eleitorado as qt_eleitorado")
			.first()
			.then((bairros) => res.json(bairros))
			.catch((_) => {});
	};

	return {
		getCalculoRegiaoVotos,
		getCalculoRegiaoEleitorados,
		getCalculoMunicipioVotos,
		getCalculoMunicipioEleitorados,
		getCalculoBairrosVotos,
		getCalculoBairrosEleitorados,
	};
};
