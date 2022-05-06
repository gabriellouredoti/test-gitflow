exports.up = function (knex, Promise) {
	return knex.schema.createTable("programacao_evento_item_apoio", (table) => {
		table.increments("id").primary();
		table.integer("programacao_evento_id").notNull();
		table.integer("item_apoio_id").notNull();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("programacao_evento_item_apoio");
};
