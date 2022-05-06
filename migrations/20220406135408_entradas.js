exports.up = function (knex, Promise) {
	return knex.schema.createTable("entradas", (table) => {
		table.increments("id").primary();
		table.string("receita").notNull();
		table.decimal("valor").notNull();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("entradas");
};
