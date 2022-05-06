exports.up = function (knex, Promise) {
	return knex.schema.createTable("importacoes", (table) => {
		table.increments("id").primary();
		table.string("nome");
		table.integer("tamanho");
		table.timestamp("data");
		table.string("filename");
		table.string("path");
		table.integer("pessoa_id");
		table.string("type");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("importacoes");
};
