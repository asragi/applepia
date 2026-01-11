import * as fs from "node:fs/promises";
import * as path from "node:path";

const CSV_DATA_PATH = process.env.CSV_DATA_PATH || "../backend/docker/mysql/init/data";

export function getDataPath(): string {
	return path.resolve(CSV_DATA_PATH);
}

export async function readCsv<T extends Record<string, unknown>>(
	filename: string
): Promise<T[]> {
	const filePath = path.join(getDataPath(), filename);
	const content = await fs.readFile(filePath, "utf-8");
	const lines = content.trim().split("\n");

	if (lines.length === 0) {
		return [];
	}

	const headers = lines[0].split(",");
	const result: T[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values = parseCsvLine(lines[i]);
		const row: Record<string, unknown> = {};

		for (let j = 0; j < headers.length; j++) {
			const header = headers[j];
			const value = values[j] ?? "";
			row[header] = parseValue(value);
		}

		result.push(row as T);
	}

	return result;
}

export async function writeCsv<T extends Record<string, unknown>>(
	filename: string,
	data: T[]
): Promise<void> {
	if (data.length === 0) {
		const filePath = path.join(getDataPath(), filename);
		await fs.writeFile(filePath, "", "utf-8");
		return;
	}

	const headers = Object.keys(data[0]);
	const lines: string[] = [headers.join(",")];

	for (const row of data) {
		const values = headers.map((header) => {
			const value = row[header];
			return formatValue(value);
		});
		lines.push(values.join(","));
	}

	const filePath = path.join(getDataPath(), filename);
	await fs.writeFile(filePath, lines.join("\n") + "\n", "utf-8");
}

function parseCsvLine(line: string): string[] {
	const values: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === "," && !inQuotes) {
			values.push(current);
			current = "";
		} else {
			current += char;
		}
	}

	values.push(current);
	return values;
}

function parseValue(value: string): string | number {
	const trimmed = value.trim();

	if (trimmed === "") {
		return "";
	}

	const num = Number(trimmed);
	if (!Number.isNaN(num) && trimmed !== "") {
		return num;
	}

	return trimmed;
}

function formatValue(value: unknown): string {
	if (value === null || value === undefined) {
		return "";
	}

	const str = String(value);

	if (str.includes(",") || str.includes('"') || str.includes("\n")) {
		return `"${str.replace(/"/g, '""')}"`;
	}

	return str;
}
