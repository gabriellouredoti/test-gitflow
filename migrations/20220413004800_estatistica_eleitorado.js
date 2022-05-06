exports.up = function (knex, Promise) {
	return knex.schema.createTable("estatistica_eleitorado", (table) => {
		table.increments("id").primary();
		table.string("municipio");
		table.string("zona");
		table.string("qt_local");
		table.string("qt_secoes");
		table.string("qt_eleitorado");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("estatistica_eleitorado");
};
