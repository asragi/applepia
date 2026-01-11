import { Router } from "express";
import type { Request, Response } from "express";
import { readCsv, writeCsv } from "../utils/csv.ts";

const router = Router();

const relationFiles: Record<string, string> = {
	"earning-items": "earning-items.csv",
	"consuming-items": "consuming-items.csv",
	"required-skills": "required-skills.csv",
	"skill-growth": "skill-growth.csv",
	"stage-explores": "stage-explore-relations.csv",
	"reduction-stamina": "reduction-stamina.csv",
	"item-explores": "item-explore-relations.csv",
};

router.get("/:type", async (req: Request, res: Response) => {
	const { type } = req.params;
	const filename = relationFiles[type];

	if (!filename) {
		res.status(404).json({ error: `Unknown relation type: ${type}` });
		return;
	}

	try {
		const data = await readCsv(filename);
		res.json(data);
	} catch (error) {
		console.error(`Failed to read ${filename}:`, error);
		res.status(500).json({ error: `Failed to read ${filename}` });
	}
});

router.put("/:type", async (req: Request, res: Response) => {
	const { type } = req.params;
	const filename = relationFiles[type];

	if (!filename) {
		res.status(404).json({ error: `Unknown relation type: ${type}` });
		return;
	}

	try {
		const data = req.body;
		if (!Array.isArray(data)) {
			res.status(400).json({ error: "Request body must be an array" });
			return;
		}

		await writeCsv(filename, data);
		res.json({ success: true });
	} catch (error) {
		console.error(`Failed to write ${filename}:`, error);
		res.status(500).json({ error: `Failed to write ${filename}` });
	}
});

export default router;
