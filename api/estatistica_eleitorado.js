module.exports = (app) => {
	const save = async (data) => {
		try {
			const fieldInsertValues = data.map((ee) => {
				return {
					municipio: ee[0],
					zona: ee[1],
					qt_local: ee[2],
					qt_secoes: ee[3],
					qt_eleitorado: ee[4],
				};
			});

			const estatistica_eleitorado = await app
				.db("estatistica_eleitorado")
				.insert(fieldInsertValues);

			return estatistica_eleitorado;
		} catch (error) {
			throw error;
		}
	};
	return { save };
};
