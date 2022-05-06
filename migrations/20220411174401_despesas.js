exports.up = function (knex, Promise) {
	return knex.schema.createTable("despesas", (table) => {
		table.increments("id").primary();
		table.integer("saida_id").notNull();
		table.integer("entrada_id").notNull();
		table.decimal("valor").notNull();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("despesas");
};
