module.exports = (app) => {
	// const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;
	const { entradaDespesas } = require("../api/queries");

	const get = (req, res) => {
		app.db
			.raw(entradaDespesas)
			.then(async (despesas) => {
				let rowsDespesa = [];

				for await (const despesa of despesas) {
					const itemsDespesa = await app
						.db("despesas")
						.innerJoin("saidas", "saidas.id", "despesas.saida_id")
						.leftJoin("municipios", "municipios.id", "saidas.municipio_id")
						.where("despesas.entrada_id", despesa.id)
						.select(
							"saidas.despesa",
							"despesas.valor",
							"saidas.data",
							"municipios.nome as nome_municipio"
						);

					rowsDespesa.push({
						id: despesa.id,
						receita: despesa.receita,
						valor: despesa.valor,
						saida: despesa.saida,
						saldo: despesa.saldo,
						item: itemsDespesa,
					});
				}

				return res.json(rowsDespesa);
			})
			.catch((err) => res.status(500).send("" + err));
	};

	return {
		get,
	};
};
