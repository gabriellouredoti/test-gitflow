exports.up = function (knex, Promise) {
	return knex.schema.createTable("item_apoio", (table) => {
		table.increments("id").primary();
		table.string("nome").notNull();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("item_apoio");
};
