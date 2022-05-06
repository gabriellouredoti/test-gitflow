const csvParser = require("../services/csvParser");

module.exports = (app) => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const save = async (file) => {
		const pathInformations = {
			nome: file.originalname,
			tamanho: file.size,
			data: Date.now(),
			filename: file.filename,
			path: file.path,
			type: file.mimetype,
		};

		const records = await csvParser.extractCsv(file.path);

		try {
			existsOrError(records, "Arquivo de importação vazio.");
		} catch (msg) {
			return;
		}
		if (records != [] && parseInt(records[0].length) == 7) {
			result = await app.api.votacao_resultado.save(records);
			await app.db("importacoes").insert(pathInformations);
			return;
		}
		if (records != [] && parseInt(records[0].length) == 37) {
			result = await app.api.votacao_municipal.save(records);
			await app.db("importacoes").insert(pathInformations);
			return;
		}
		if (records != [] && parseInt(records[0].length) == 5) {
			let prepareData = [];
			records.forEach((a) => {
				prepareData.push([
					a[0],
					a[1],
					a[2],
					a[3],
					a[4] ? a[4].replace(/[|&;$%@"<>()+,.]/g, "") : 0,
				]);
			});
			result = await app.api.estatistica_eleitorado.save(prepareData);
			await app.db("importacoes").insert(pathInformations);
			return;
		}
		if (records != [] && parseInt(records[0].length) == 14) {
			let csvData = [];
			records.forEach((r) => {
				if (r[10] == "43555") {
					csvData.push(r);
				}
			});
			result = await app.api.votacao_secao.save(csvData);
			await app.db("importacoes").insert(pathInformations);
			return;
		}
	};

	const get = (req, res) => {
		app
			.db("importacoes")
			.select("nome", "tamanho", "data", "filename", "path", "type")
			.then((importacoes) => res.json(importacoes))
			.catch((err) => res.status(500).send(err));
	};

	return {
		save,
		get,
	};
};
