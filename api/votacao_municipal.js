module.exports = (app) => {
	const save = async (data) => {
		try {
			const fieldInsertValues = data.map((vs) => {
				return {
					dt_geracao: vs[0],
					hh_geracao: vs[1],
					ano_eleicao: vs[2],
					cd_tipo_eleicao: vs[3],
					nm_tipo_eleicao: vs[4],
					nr_turno: vs[5],
					cd_eleicao: vs[6],
					ds_eleicao: vs[7],
					dt_eleicao: vs[8],
					tp_abrangencia: vs[9],
					sg_uf: vs[10],
					sg_ue: vs[11],
					nm_ue: vs[12],
					cd_municipio: vs[13],
					nm_municipio: vs[14],
					nr_zona: vs[15],
					cd_cargo: vs[16],
					ds_cargo: vs[17],
					qt_aptos: vs[18],
					qt_secoes: vs[19],
					qt_secoes_agregadas: vs[20],
					qt_aptos_tot: vs[21],
					qt_secoes_tot: vs[22],
					qt_comparecimento: vs[23],
					qt_abstencoes: vs[24],
					st_voto_em_transito: vs[25],
					qt_votos_nominais: vs[26],
					qt_votos_brancos: vs[27],
					qt_votos_nulos: vs[28],
					qt_votos_legenda: vs[29],
					qt_votos_pendentes: vs[30],
					qt_votos_anulados: vs[31],
					qt_votos_nulo_tecnico: vs[32],
					qt_votos_anulado_sub_judice: vs[33],
					qt_votos_sem_cand_p_votar: vs[34],
					hh_ultima_totalizacao: vs[35],
					dt_ultima_totalizacao: vs[36],
				};
			});

			for await (const vs of fieldInsertValues) {
				await app.db("votacao_municipal").insert(vs);
			}

			return fieldInsertValues;
		} catch (error) {
			throw error;
		}
	};
	return { save };
};
