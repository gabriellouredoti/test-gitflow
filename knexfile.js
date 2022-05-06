module.exports = {
	client: "sqlite3",
	connection: {
		filename: "./db.sqlite3",
	},
	useNullAsDefault: true,
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: "knex_migrations",
	},
};
