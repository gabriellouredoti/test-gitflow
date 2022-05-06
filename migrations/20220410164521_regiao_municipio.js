exports.up = function (knex, Promise) {
	return knex.schema.createTable("regiao_municipio", (table) => {
		table.integer("regiao_id").notNull();
		table.integer("municipio_id").notNull();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("regiao_municipio");
};
