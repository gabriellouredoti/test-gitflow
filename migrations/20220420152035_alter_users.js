exports.up = function (knex, Promise) {
	return knex.schema.table("users", (table) => {
		table.timestamp("deleted_at");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table("users", (table) => {
		table.dropColumn("deleted_at");
	});
};
