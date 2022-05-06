module.exports = (app) => {
	const save = async (data) => {
		try {
			const fieldInsertValues = data.map((vm) => {
				return {
					ano: vm[0],
					turno: vm[1],
					cd_cargo: vm[2],
					cargo: vm[3],
					cod_municipio: vm[4],
					nome_municipio: vm[5],
					zona: vm[6],
					cd_local_votacao: vm[7],
					nm_local: vm[8],
					secao: vm[9],
					nr_candidato: vm[10],
					candidato: vm[11],
					nome_urna: vm[12],
					qt_votos: vm[13],
				};
			});

			for await (const vm of fieldInsertValues) {
				await app.db("votacao_secao").insert(vm);
			}

			return fieldInsertValues;
		} catch (error) {
			throw error;
		}
	};
	return { save };
};
