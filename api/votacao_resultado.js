module.exports = (app) => {
	const save = async (data) => {
		try {
			const fieldInsertValues = data.map((vm) => {
				return {
					nr_cadidato: vm[0],
					municipio: vm[1],
					zona: vm[2],
					escola: vm[3],
					bairro: vm[4],
					secao: vm[5],
					qt_votos: vm[6] ? vm[6].replace(/[|&;$%@"<>()+,.]/g, "") : 0,
				};
			});

			for await (const re of fieldInsertValues) {
				await app.db("votacao_resultado").insert(re);
			}

			return fieldInsertValues;
		} catch (error) {
			console.log("err" + error);
		}
	};
	return { save };
};
