const admin = require("./admin");
const multer = require("multer");

const upload = multer({
	dest: "./tmp",
});

module.exports = (app) => {
	app.post("/signup", app.api.user.save);
	app.post("/signin", app.api.auth.signIn);
	app.post("/validateToken", app.api.auth.validateToken);

	app
		.route("/users")
		.all(app.config.passport.authenticate())
		.post(app.api.user.save)
		.get(app.api.user.get);

	app
		.route("/export-database")
		.all(app.config.passport.authenticate())
		.get(app.api.export_database.export_database);

	app
		.route("/users/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.user.save)
		.get(app.api.user.getById)
		.delete(app.api.user.remove);

	// Rota de cadastro de bairros
	app
		.route("/bairros")
		.all(app.config.passport.authenticate())
		.post(app.api.bairro.save)
		.get(app.api.bairro.get);

	app
		.route("/bairros/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.bairro.save)
		.get(app.api.bairro.getById)
		.delete(app.api.bairro.remove);

	// Rota de cadastro de tipo de coordenador
	app
		.route("/tipo-coordenador")
		.all(app.config.passport.authenticate())
		.post(app.api.tipo_coordenador.save)
		.get(app.api.tipo_coordenador.get);

	app
		.route("/tipo-coordenador/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.tipo_coordenador.save)
		.get(app.api.tipo_coordenador.getById)
		.delete(app.api.tipo_coordenador.remove);

	// Rota de cadastro de municípios
	app
		.route("/municipios")
		.all(app.config.passport.authenticate())
		.post(app.api.municipio.save)
		.get(app.api.municipio.get);

	app
		.route("/municipios/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.municipio.save)
		.get(app.api.municipio.getById)
		.delete(app.api.municipio.remove);

	// Rota de cadastro de zonas
	app
		.route("/zonas")
		.all(app.config.passport.authenticate())
		.post(app.api.zona.save)
		.get(app.api.zona.get);

	app
		.route("/zonas/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.zona.save)
		.get(app.api.zona.getById)
		.delete(app.api.zona.remove);

	// Rota de tipo de evento
	app
		.route("/tipo-evento")
		.all(app.config.passport.authenticate())
		.post(app.api.tipo_evento.save)
		.get(app.api.tipo_evento.get);

	app
		.route("/tipo-evento/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.tipo_evento.save)
		.get(app.api.tipo_evento.getById)
		.delete(app.api.tipo_evento.remove);

	// Rota de tipo de despesa
	app
		.route("/item-despesa")
		.all(app.config.passport.authenticate())
		.post(app.api.item_despesa.save)
		.get(app.api.item_despesa.get);

	app
		.route("/item-despesa/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.item_despesa.save)
		.get(app.api.item_despesa.getById)
		.delete(app.api.item_despesa.remove);

	// Rota de equipes
	app
		.route("/equipes")
		.all(app.config.passport.authenticate())
		.post(app.api.equipe.save)
		.get(app.api.equipe.get);

	app
		.route("/equipes/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.equipe.save)
		.get(app.api.equipe.getById)
		.delete(app.api.equipe.remove);

	// Rota de entradas/receitas
	app
		.route("/entradas")
		.all(app.config.passport.authenticate())
		.post(app.api.entrada.save)
		.get(app.api.entrada.get);

	app
		.route("/entradas/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.entrada.save)
		.get(app.api.entrada.getById)
		.delete(app.api.entrada.remove);

	// Rota de item de apoio
	app
		.route("/item-apoio")
		.all(app.config.passport.authenticate())
		.post(app.api.item_apoio.save)
		.get(app.api.item_apoio.get);

	app
		.route("/item-apoio/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.item_apoio.save)
		.get(app.api.item_apoio.getById)
		.delete(app.api.item_apoio.remove);

	// Rota de coordenador
	app
		.route("/coordenadores")
		.all(app.config.passport.authenticate())
		.post(app.api.pessoa.save)
		.get(app.api.pessoa.get);

	app
		.route("/coordenadores/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.pessoa.save)
		.get(app.api.pessoa.getById)
		.delete(app.api.pessoa.remove);

	// Rota de candidato
	app
		.route("/candidatos")
		.all(app.config.passport.authenticate())
		.post(app.api.candidato.save)
		.get(app.api.candidato.get);

	app
		.route("/candidatos/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.candidato.save)
		.get(app.api.candidato.getById)
		.delete(app.api.candidato.remove);

	// Rota de regioes
	app
		.route("/regioes")
		.all(app.config.passport.authenticate())
		.post(app.api.regiao.save)
		.get(app.api.regiao.get);

	app
		.route("/regioes/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.regiao.save)
		.get(app.api.regiao.getById)
		.delete(app.api.regiao.remove);

	// Rota para programacao de eventos
	app
		.route("/programacao-evento")
		.all(app.config.passport.authenticate())
		.post(app.api.programacao_evento.save)
		.get(app.api.programacao_evento.get);

	app
		.route("/programacao-evento/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.programacao_evento.save)
		.get(app.api.programacao_evento.getById)
		.delete(app.api.programacao_evento.remove);

	// Rota para programacao de candidato
	app
		.route("/programacao-candidato")
		.all(app.config.passport.authenticate())
		.post(app.api.programacao_candidato.save)
		.get(app.api.programacao_candidato.get);

	app
		.route("/programacao-candidato/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.programacao_candidato.save)
		.get(app.api.programacao_candidato.getById)
		.delete(app.api.programacao_candidato.remove);

	// Rota para programacao de eventos
	app
		.route("/saidas")
		.all(app.config.passport.authenticate())
		.post(app.api.saida.save)
		.get(app.api.saida.get);

	app
		.route("/saidas/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.saida.save)
		.get(app.api.saida.getById)
		.delete(app.api.saida.remove);

	// Rota para despesas
	app
		.route("/despesas")
		.all(app.config.passport.authenticate())
		.get(app.api.despesa.get);

	// Rota para metas municipio
	app
		.route("/metas-municipio")
		.all(app.config.passport.authenticate())
		.post(app.api.metas_municipio.save)
		.get(app.api.metas_municipio.get);

	app
		.route("/metas-municipio/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.metas_municipio.save)
		.get(app.api.metas_municipio.getById)
		.delete(app.api.metas_municipio.remove);

	// Rota para metas regiao
	app
		.route("/metas-regiao")
		.all(app.config.passport.authenticate())
		.post(app.api.metas_regiao.save)
		.get(app.api.metas_regiao.get);

	app
		.route("/metas-regiao/:id")
		.all(app.config.passport.authenticate())
		.put(app.api.metas_regiao.save)
		.get(app.api.metas_regiao.getById)
		.delete(app.api.metas_regiao.remove);

	// Rota para importacoes
	app.post("/importacoes", upload.single("file"), async function (req, res) {
		const result = await app.api.importacao.save(req.file);
		return res.json(result);
	});

	app
		.route("/importacoes")
		.all(app.config.passport.authenticate())
		.get(app.api.importacao.get);

	// Rota para resultados
	app
		.route("/resultados")
		.all(app.config.passport.authenticate())
		.get(app.api.resultados.get);

	// Rota para dashboard
	app
		.route("/dashboard/resultado-regioes")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_votacao.getResultadoRegiao);

	app
		.route("/dashboard/resultado-municipios")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_votacao.getResultadoMunicipio);

	app
		.route("/dashboard/resultado-bairros")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_votacao.getResultadoBairro);

	app
		.route("/dashboard/resultado-zona")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_zona_secao.getResultadoZona);

	app
		.route("/dashboard/resultado-secao")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_zona_secao.getResultadoSecao);

	app
		.route("/dashboard/resultado-meta-regiao")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_meta_regiao.getMetaRegiao);

	app
		.route("/dashboard/resultado-meta-municipio")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_meta_municipio.getMetaMunicipio);

	app
		.route("/dashboard/resultado-meta-equipe")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_meta_municipio.getMetaEquipe);

	app
		.route("/dashboard/resultado-meta-subgrupo")
		.all(app.config.passport.authenticate())
		.get(app.api.resultado_meta_subgrupo.getMetasSubgrupos);

	// Rota para combos
	app
		.route("/assets/municipios")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getMunicipios);

	app
		.route("/assets/coordenadores")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getCoordenadores);

	app
		.route("/assets/item-apoio")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getItemApoio);

	app
		.route("/assets/tipo-evento")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getTipoEvento);

	app
		.route("/assets/entradas")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getEntradas);

	app
		.route("/assets/tipo-despesa")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getTipoDespesa);

	app
		.route("/assets/regioes")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getRegioes);

	app
		.route("/assets/regioes/:regiao_id/municipios")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getMunicipios);

	app
		.route("/assets/regioes/municipios")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getMunicipios);

	app
		.route("/assets/bairros/municipios")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getBairros);

	app
		.route("/assets/equipes")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getEquipes);

	app
		.route("/assets/equipes/municipios")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getEquipes);

	app
		.route("/assets/municipios/:municipio_id/bairros")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getBairros);

	app
		.route("/assets/zonas")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getZonas);

	app
		.route("/assets/zonas-eleitorais")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getZonasEleitorais);

	app
		.route("/assets/zonas-eleitorais/secoes-eleitorais")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getSecoesEleitorais);

	app
		.route("/assets/votos/regioes")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getVotosRegiao);

	app
		.route("/assets/votos/regioes/municipios")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getVotosRegiaoMunicipio);

	app
		.route("/assets/votos/muncipios")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getVotosMunicipio);

	app
		.route("/assets/votos/muncipios/bairros")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getVotosMunicipioBairro);

	app
		.route("/assets/metas-subgrupos")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getMetasSubgrupos);

	app
		.route("/assets/tipo-coordenador")
		.all(app.config.passport.authenticate())
		.get(app.api.assets.getTipoCoordenador);

	app
		.route("/functions/regioes/:regiao_id/votos")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoRegiaoVotos);

	app
		.route("/functions/regioes/:regiao_id/eleitorados")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoRegiaoEleitorados);

	app
		.route("/functions/regioes/votos")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoRegiaoVotos);

	app
		.route("/functions/regioes/eleitorados")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoRegiaoEleitorados);

	app
		.route("/functions/municipios/:municipio_id/votos")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoMunicipioVotos);

	app
		.route("/functions/municipios/:municipio_id/eleitorados")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoMunicipioEleitorados);

	app
		.route("/functions/municipios/votos")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoMunicipioVotos);

	app
		.route("/functions/municipios/eleitorados")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoMunicipioEleitorados);

	app
		.route("/functions/municipios/:municipio_id/bairros/:bairro_id/votos")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoBairrosVotos);

	app
		.route("/functions/municipios/:municipio_id/bairros/:bairro_id/eleitorados")
		.all(app.config.passport.authenticate())
		.get(app.api.functions.getCalculoBairrosEleitorados);

	// Rota de fallback
	app.route("*").get((req, res) => {
		res.status(404).json({ error: "Rota inválida" });
	});
};
