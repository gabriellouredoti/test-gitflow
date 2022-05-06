exports.up = function (knex, Promise) {
	return knex.schema.table("pessoas", (table) => {
		table.integer("municipio_id");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table("pessoas", (table) => {
		table.dropColumn("municipio_id");
	});
};
