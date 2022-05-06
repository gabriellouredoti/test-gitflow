exports.up = function (knex, Promise) {
	return knex.schema.createTable("municipios", (table) => {
		table.increments("id").primary();
		table.string("nome").notNull();
		table.integer("codigo");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("municipios");
};
