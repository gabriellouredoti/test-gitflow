exports.up = function (knex, Promise) {
	return knex.schema.createTable("votacao_secao", (table) => {
		table.increments("id").primary();
		table.string("ano");
		table.string("turno");
		table.string("cd_cargo");
		table.string("cargo");
		table.string("cod_municipio");
		table.string("nome_municipio");
		table.string("zona");
		table.string("cd_local_votacao");
		table.string("nm_local");
		table.string("secao");
		table.string("nr_candidato");
		table.string("candidato");
		table.string("nome_urna");
		table.string("qt_votos");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("votacao_secao");
};
