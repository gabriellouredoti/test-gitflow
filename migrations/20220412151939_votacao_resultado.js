exports.up = function (knex, Promise) {
	return knex.schema.createTable("votacao_resultado", (table) => {
		table.increments("id").primary();
		table.string("municipio");
		table.string("zona");
		table.string("escola");
		table.string("bairro");
		table.string("secao");
		table.string("qt_votos");
		table.string("nr_cadidato");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("votacao_resultado");
};
