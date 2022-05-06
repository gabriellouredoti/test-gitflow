module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (req, res) => {
		const programacao_evento = {
			...req.body,
		};

		if (req.params.id) programacao_evento.id = req.params.id;

		if (programacao_evento.id) {
			//Use transaction query programacao evento update
			try {
				await app.db
					.transaction(async (trx) => {
						await trx("programacao_evento")
							.update({
								municipio_id: programacao_evento.municipio_id,
								bairro_id: programacao_evento.bairro_id,
								pessoa_id: programacao_evento.pessoa_id,
								tipo_evento_id: programacao_evento.tipo_evento_id,
								endereco: programacao_evento.endereco,
								dt_inicio: programacao_evento.dt_inicio,
								dt_fim: programacao_evento.dt_fim,
								solicitante: programacao_evento.solicitante,
								observacao: programacao_evento.observacao,
								status: programacao_evento.status,
								tipo: 1,
								valor: programacao_evento.valor,
							})
							.where({
								id: programacao_evento.id,
							});

						await trx("programacao_evento_item_apoio").del().where({
							programacao_evento_id: programacao_evento.id,
						});

						const fieldInsertItemApoio = programacao_evento.item_apoio.map(
							(ie) => {
								return {
									programacao_evento_id: programacao_evento.id,
									item_apoio_id: ie.id,
								};
							}
						);

						const programacao_evento_item_apoio = await app
							.db("programacao_evento_item_apoio")
							.insert(fieldInsertItemApoio)
							.transacting(trx);

						return programacao_evento_item_apoio;
					})
					.then((programacao_evento) => res.status(204).send())
					.catch((err) => res.status(500).send("" + err));
			} catch (err) {
				return res.status(500).send(err);
			}
		} else {
			//Use transaction query programacao_evento insert
			try {
				await app.db
					.transaction(async (trx) => {
						const programacao_evento_id = await trx(
							"programacao_evento"
						).insert(
							{
								municipio_id: programacao_evento.municipio_id,
								bairro_id: programacao_evento.bairro_id,
								pessoa_id: programacao_evento.pessoa_id,
								tipo_evento_id: programacao_evento.tipo_evento_id,
								endereco: programacao_evento.endereco,
								dt_inicio: programacao_evento.dt_inicio,
								dt_fim: programacao_evento.dt_fim,
								solicitante: programacao_evento.solicitante,
								observacao: programacao_evento.observacao,
								status: programacao_evento.status,
								tipo: 1,
								valor: programacao_evento.valor,
							},
							"id"
						);

						const fieldInsertItemApoio = programacao_evento.item_apoio.map(
							(ie) => {
								return {
									programacao_evento_id: programacao_evento_id,
									item_apoio_id: ie.id,
								};
							}
						);

						const programacao_evento_item_apoio = await trx(
							"programacao_evento_item_apoio"
						).insert(fieldInsertItemApoio);

						return programacao_evento_item_apoio;
					})
					.then((programacao_evento) => {
						return res.status(204).send();
					});
			} catch (err) {
				return res.status(500).send("" + err);
			}
		}
	};

	const get = (req, res) => {
		app
			.db("programacao_evento")
			.leftJoin(
				"tipo_evento",
				"tipo_evento.id",
				"programacao_evento.tipo_evento_id"
			)
			.leftJoin(
				"municipios",
				"municipios.id",
				"programacao_evento.municipio_id"
			)
			.leftJoin("bairros", "bairros.id", "programacao_evento.bairro_id")
			.leftJoin("pessoas", "pessoas.id", "programacao_evento.pessoa_id")
			.where("programacao_evento.tipo", 1)
			.select(
				"programacao_evento.id",
				"programacao_evento.municipio_id",
				"programacao_evento.bairro_id",
				"programacao_evento.pessoa_id",
				"programacao_evento.tipo_evento_id",
				"programacao_evento.endereco",
				"programacao_evento.dt_inicio",
				"programacao_evento.dt_fim",
				"programacao_evento.solicitante",
				"programacao_evento.observacao",
				"programacao_evento.status",
				"programacao_evento.tipo",
				"programacao_evento.valor",
				"tipo_evento.nome as tipo_evento_nome",
				"municipios.nome as municipio_nome",
				"bairros.nome as bairro_nome",
				"pessoas.nome as coordenador_nome"
			)
			.then((programacao_evento) => res.json(programacao_evento))
			.catch((err) => res.status(500).send(err));
	};

	const getById = (req, res) => {
		app
			.db("programacao_evento")
			.where({
				id: req.params.id,
				tipo: 1,
			})
			.first(
				"id",
				"municipio_id",
				"bairro_id",
				"pessoa_id",
				"tipo_evento_id",
				"endereco",
				"dt_inicio",
				"dt_fim",
				"solicitante",
				"observacao",
				"status",
				"tipo",
				"valor"
			)
			.then(async (programacao_evento) => {
				const item_apoio = await app
					.db("programacao_evento_item_apoio")
					.innerJoin(
						"item_apoio",
						"programacao_evento_item_apoio.item_apoio_id",
						"item_apoio.id"
					)
					.where("programacao_evento_id", programacao_evento.id)
					.select("item_apoio.id", "item_apoio.nome");

				programacao_evento = { ...programacao_evento, item_apoio: item_apoio };

				return res.status(200).json(programacao_evento);
			})
			.catch((err) => res.status(500).send(err));
	};

	const remove = async (req, res) => {
		try {
			// Desvincula programacao de evento vinculadas a itens de apoio
			await app
				.db("programacao_evento_item_apoio")
				.del()
				.where("programacao_evento_id", req.params.id);

			const rowsDeleted = await app
				.db("programacao_evento")
				.del()
				.where("id", req.params.id);

			existsOrError(rowsDeleted, "Programação de evento não encontrado");

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
