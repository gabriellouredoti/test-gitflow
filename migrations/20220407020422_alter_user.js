exports.up = function (knex, Promise) {
	return knex.schema.table("users", (table) => {
		table.integer("perfil_id");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table("users", (table) => {
		table.dropColumn("perfil_id");
	});
};
