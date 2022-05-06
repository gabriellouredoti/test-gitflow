module.exports = (app) => {
	const export_database = (req, res) => {
		return res.download("./db.sqlite3", "db.sqlite3");
	};

	return {
		export_database,
	};
};
