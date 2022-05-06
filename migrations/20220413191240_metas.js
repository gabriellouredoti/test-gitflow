exports.up = function (knex, Promise) {
	return knex.schema.createTable("metas", (table) => {
		table.increments("id").primary();
		table.string("ano");
		table.integer("municipio_id");
		table.integer("zona_id");
		table.integer("bairro_id");
		table.integer("qt_eleitorado");
		table.decimal("previsao_orcamentaria");
		table.integer("pessoa_id");
		table.integer("equipe_id");
		table.integer("qt_votos");
		table.integer("qt_meta_votos");
		table.integer("qt_meta_votos_2");
		table.integer("qt_meta_votos_3");
		table.integer("regiao_id");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("metas");
};
