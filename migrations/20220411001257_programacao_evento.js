exports.up = function (knex, Promise) {
	return knex.schema.createTable("programacao_evento", (table) => {
		table.increments("id").primary();
		table.integer("municipio_id");
		table.integer("pessoa_id");
		table.integer("tipo_evento_id");
		table.string("endereco");
		table.timestamp("dt_inicio").defaultTo(knex.fn.now());
		table.timestamp("dt_fim");
		table.string("solicitante");
		table.string("observacao");
		table.integer("status").defaultTo(0);
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("programacao_evento");
};
