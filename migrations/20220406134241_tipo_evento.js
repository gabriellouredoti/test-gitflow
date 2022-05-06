exports.up = function (knex, Promise) {
	return knex.schema.createTable("tipo_evento", (table) => {
		table.increments("id").primary();
		table.string("nome").notNull();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("tipo_evento");
};
