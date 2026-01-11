import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHookWithRouter, flushPromises } from "../../test-utils/renderHookWithRouter.ts";
import { setupWindowMock } from "../../test-utils/window.ts";
import { useExploresPresenter } from "./presenter.ts";
import type { ExploreMaster, ItemMaster, SkillMaster } from "../../types/masters.ts";
import type { EarningItem, ConsumingItem, RequiredSkill, SkillGrowth } from "../../types/relations.ts";
import { fetchMaster, fetchRelation, saveMaster, saveRelation } from "../../api/client.ts";

vi.mock("../../api/client.ts");

const exploresMock: ExploreMaster[] = [
	{
		id: 1,
		ExploreId: 1,
		DisplayName: "採集",
		Description: "",
		ConsumingStamina: 1,
		RequiredPayment: 0,
		StaminaReducibleRate: 0,
	},
	{
		id: 2,
		ExploreId: 2,
		DisplayName: "調理",
		Description: "",
		ConsumingStamina: 2,
		RequiredPayment: 0,
		StaminaReducibleRate: 0,
	},
];

const itemsMock: ItemMaster[] = [
	{ id: 1, item_id: 10, DisplayName: "りんご", Description: "", Price: 10, MaxStock: 1, Attraction: 1, PurchaseProb: 0.1 },
];

const skillsMock: SkillMaster[] = [
	{ id: 1, SkillId: 5, DisplayName: "料理" },
];

const earningItemsMock: EarningItem[] = [];
const consumingItemsMock: ConsumingItem[] = [];
const requiredSkillsMock: RequiredSkill[] = [];
const skillGrowthMock: SkillGrowth[] = [];

const fetchMasterMock = vi.mocked(fetchMaster);
const fetchRelationMock = vi.mocked(fetchRelation);
const saveMasterMock = vi.mocked(saveMaster);
const saveRelationMock = vi.mocked(saveRelation);

beforeEach(() => {
	fetchMasterMock.mockImplementation(async (type) => {
		if (type === "explores") return exploresMock;
		if (type === "items") return itemsMock;
		if (type === "skills") return skillsMock;
		return [];
	});
	fetchRelationMock.mockImplementation(async (type) => {
		if (type === "earning-items") return earningItemsMock;
		if (type === "consuming-items") return consumingItemsMock;
		if (type === "required-skills") return requiredSkillsMock;
		if (type === "skill-growth") return skillGrowthMock;
		return [];
	});
	saveMasterMock.mockResolvedValue();
	saveRelationMock.mockResolvedValue();
	setupWindowMock();
});

afterEach(() => {
	vi.clearAllMocks();
});

async function renderPresenter(initialPath = "/explores") {
	const result = await renderHookWithRouter(useExploresPresenter, {
		initialPath,
		routePath: "/explores",
	});
	await flushPromises();
	return result;
}

describe("useExploresPresenter", () => {
	it("URLパラメータselectedから初期選択を復元する", async () => {
		const { getResult } = await renderPresenter("/explores?selected=2");
		expect(getResult().selectedId).toBe(2);
	});

	it("onSelectで選択とクエリパラメータを同期する", async () => {
		const { getResult, router } = await renderPresenter();

		await getResult().onSelect(1);
		await flushPromises();
		expect(getResult().selectedId).toBe(1);
		expect(router.state.location.search).toBe("?selected=1");

		await getResult().onSelect(1);
		await flushPromises();
		expect(getResult().selectedId).toBeNull();
		expect(router.state.location.search).toBe("");
	});

	it("onAddで新規レコードを選択しクエリパラメータを設定する", async () => {
		const { getResult, router } = await renderPresenter();

		await getResult().onAdd();
		await flushPromises();

		expect(getResult().selectedId).toBe(3);
		expect(router.state.location.search).toBe("?selected=3");
		expect(getResult().data.find((item) => item.ExploreId === 3)).toBeTruthy();
	});

	it("削除時に選択中のレコードを消したらクエリパラメータをクリアする", async () => {
		const { getResult, router } = await renderPresenter();

		await getResult().onSelect(1);
		await flushPromises();
		await getResult().onDelete(1);
		await flushPromises();

		expect(getResult().selectedId).toBeNull();
		expect(router.state.location.search).toBe("");
	});
});
