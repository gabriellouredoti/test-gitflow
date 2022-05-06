const moment = require("moment");

module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const saida = {
			...req.body,
		};

		if (req.params.id) saida.id = req.params.id;

		try {
			existsOrError(saida.despesa, "Saida não informada.");

			const saidaFromDB = await app
				.db("saidas")
				.where({
					despesa: saida.despesa,
				})
				.first();
			if (!saida.id) {
				notExistsOrError(saidaFromDB, "Saída já cadastrada.");
			}
		} catch (msg) {
			return res.status(400).send(msg);
		}

		if (saida.id) {
			//Use transaction query saida update
			try {
				await app.db
					.transaction(async (trx) => {
						await trx("saidas")
							.update({
								despesa: saida.despesa,
								valor: saida.valor,
								municipio_id: saida.municipio_id,
								tipo_despesa_id: saida.tipo_despesa_id,
							})
							.where({
								id: saida.id,
							});

						await trx("despesas").del().where({
							saida_id: saida.id,
						});

						const fieldInsertDespesas = saida.entrada.map((e) => {
							return {
								saida_id: saida.id,
								entrada_id: e.entrada_id,
								valor: e.valor,
							};
						});

						const despesas = await trx("despesas").insert(fieldInsertDespesas);

						return despesas;
					})
					.then((saida) => res.status(204).send())
					.catch((err) => res.status(500).send("" + err));
			} catch (err) {
				return res.status(500).send(err);
			}
		} else {
			//Use transaction query saida insert
			try {
				await app.db
					.transaction(async (trx) => {
						const saida_id = await trx("saidas").insert(
							{
								despesa: saida.despesa,
								valor: saida.valor,
								data: moment().format("YYYY-MM-DD"),
								municipio_id: saida.municipio_id,
								tipo_despesa_id: saida.tipo_despesa_id,
							},
							"id"
						);

						const fieldInsertDespesas = saida.entrada.map((e) => {
							return {
								saida_id: saida_id,
								entrada_id: e.entrada_id,
								valor: e.valor,
							};
						});

						const despesa = await trx("despesas").insert(fieldInsertDespesas);

						return despesa;
					})
					.then((saida) => {
						return res.status(204).send();
					});
			} catch (err) {
				return res.status(500).send("" + err);
			}
		}
	};

	const get = (req, res) => {
		app
			.db("saidas")
			.innerJoin("tipo_despesa", "tipo_despesa.id", "saidas.tipo_despesa_id")
			.leftJoin("municipios", "municipios.id", "saidas.municipio_id")
			.select(
				"saidas.id",
				"saidas.despesa",
				"saidas.valor",
				"saidas.municipio_id",
				"saidas.tipo_despesa_id",
				"tipo_despesa.nome as tipo_despesa_nome",
				"municipios.nome as municipio_nome"
			)
			.then((saida) => res.json(saida))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("saidas")
			.innerJoin("tipo_despesa", "tipo_despesa.id", "saidas.tipo_despesa_id")
			.where("saidas.id", req.params.id)
			.first(
				"saidas.id",
				"saidas.despesa",
				"saidas.valor",
				"saidas.municipio_id",
				"saidas.tipo_despesa_id",
				"saidas.tipo_despesa_id",
				"tipo_despesa.nome as tipo_despesa_nome"
			)
			.then(async (saida) => {
				const entradas = await app
					.db("despesas")
					.where("despesas.saida_id", saida.id)
					.select("despesas.entrada_id", "despesas.valor");

				saida = { ...saida, entrada: entradas };

				return res.status(200).json(saida);
			})
			.catch((err) => res.status(500).send("" + err));
	};

	const remove = async (req, res) => {
		try {
			// Desvincula despesas criadas com base em uma saida
			await app.db("despesas").del().where("saida_id", req.params.id);

			const rowsDeleted = await app
				.db("saidas")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Despesa não encontrada");

			return res.status(204).send();
		} catch (msg) {
			return res.status(400).send(msg);
		}
	};

	return {
		save,
		get,
		getById,
		remove,
	};
};
