exports.up = function (knex, Promise) {
	return knex.schema.createTable("pessoas", (table) => {
		table.increments("id").primary();
		table.string("nome").notNull();
		table.integer("codigo");
		table.integer("tipo");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("pessoas");
};
