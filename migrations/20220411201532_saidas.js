exports.up = function (knex, Promise) {
	return knex.schema.createTable("saidas", (table) => {
		table.increments("id").primary();
		table.integer("tipo_despesa_id").notNull();
		table.string("despesa").notNull();
		table.timestamp("data");
		table.decimal("valor").notNull();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("saidas");
};
