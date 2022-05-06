exports.up = function (knex, Promise) {
	return knex.schema.createTable("metas_subgrupos", (table) => {
		table.increments("id").primary();
		table.integer("bairro_id");
		table.integer("pessoa_id");
		table.integer("meta_id");
		table.string("nome");
		table.integer("qt_meta_votos");
		table.integer("qt_meta_votos_2");
		table.integer("qt_meta_votos_3");
		table.decimal("previsao_orcamentaria");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("metas_subgrupos");
};
