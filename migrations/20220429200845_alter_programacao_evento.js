exports.up = function (knex, Promise) {
	return knex.schema.table("programacao_evento", (table) => {
		table.integer("tipo");
		table.decimal("valor");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table("programacao_evento", (table) => {
		table.dropColumn("tipo");
		table.dropColumn("valor");
	});
};
