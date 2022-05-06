module.exports = (app) => {
	// const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const { resultadosApurados } = require("./queries");

	const get = (req, res) => {
		app.db
			.raw(resultadosApurados)
			.then((resultados) => res.json(resultados))
			.catch((err) => res.status(500).send(err));
	};

	return {
		get,
	};
};
