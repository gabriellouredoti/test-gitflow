const fs = require("fs").promises;
const parse = require("csv-parse/lib/sync");

const extractCsv = async (path) => {
	let default_options = {
		from_line: 1,
		bom: true,
		columns: false,
		columns_duplicates_to_array: false,
		encoding: "latin1",
		delimiter: [";"],
		relax_column_count: true,
		quote: '"',
		escape: '"',
		relax: true,
		skip_empty_lines: true,
	};

	const fileContent = await fs.readFile(`${path}`);
	const records = parse(fileContent, default_options);

	return records;
};

module.exports = {
	extractCsv,
};
