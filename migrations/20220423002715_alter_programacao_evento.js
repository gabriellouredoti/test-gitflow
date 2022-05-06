exports.up = function (knex, Promise) {
	return knex.schema.table("programacao_evento", (table) => {
		table.integer("bairro_id");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table("programacao_evento", (table) => {
		table.dropColumn("bairro_id");
	});
};
