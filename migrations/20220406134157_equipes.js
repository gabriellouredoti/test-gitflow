exports.up = function (knex, Promise) {
	return knex.schema.createTable("equipes", (table) => {
		table.increments("id").primary();
		table.string("nome").notNull();
		table.integer("pessoa_id");
		table.integer("municipio_id");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("equipes");
};
