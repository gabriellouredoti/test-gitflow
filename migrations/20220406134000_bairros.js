exports.up = function (knex, Promise) {
	return knex.schema.createTable("bairros", (table) => {
		table.increments("id").primary();
		table.string("nome").notNull();
		table.integer("municipio_id");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("bairros");
};
