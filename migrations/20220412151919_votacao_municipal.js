exports.up = function (knex, Promise) {
	return knex.schema.createTable("votacao_municipal", (table) => {
		table.increments("id").primary();
		table.string("dt_geracao");
		table.string("hh_geracao");
		table.string("ano_eleicao");
		table.string("cd_tipo_eleicao");
		table.string("nm_tipo_eleicao");
		table.string("nr_turno");
		table.string("cd_eleicao");
		table.string("ds_eleicao");
		table.string("dt_eleicao");
		table.string("tp_abrangencia");
		table.string("sg_uf");
		table.string("sg_ue");
		table.string("nm_ue");
		table.string("cd_municipio");
		table.string("nm_municipio");
		table.string("nr_zona");
		table.string("cd_cargo");
		table.string("ds_cargo");
		table.string("qt_aptos");
		table.string("qt_secoes");
		table.string("qt_secoes_agregadas");
		table.string("qt_aptos_tot");
		table.string("qt_secoes_tot");
		table.string("qt_comparecimento");
		table.string("qt_abstencoes");
		table.string("st_voto_em_transito");
		table.string("qt_votos_nominais");
		table.string("qt_votos_brancos");
		table.string("qt_votos_nulos");
		table.string("qt_votos_legenda");
		table.string("qt_votos_pendentes");
		table.string("qt_votos_anulados");
		table.string("qt_votos_nulo_tecnico");
		table.string("qt_votos_anulado_sub_judice");
		table.string("qt_votos_sem_cand_p_votar");
		table.string("hh_ultima_totalizacao");
		table.string("dt_ultima_totalizacao");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("votacao_municipal");
};
