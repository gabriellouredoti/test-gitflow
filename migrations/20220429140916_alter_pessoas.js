exports.up = function (knex, Promise) {
	return knex.schema.table("pessoas", (table) => {
		table.integer("tipo_coordenador_id");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table("pessoas", (table) => {
		table.dropColumn("tipo_coordenador_id");
	});
};
