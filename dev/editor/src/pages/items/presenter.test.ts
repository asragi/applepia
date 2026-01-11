import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHookWithRouter, flushPromises } from "../../test-utils/renderHookWithRouter.ts";
import { setupWindowMock } from "../../test-utils/window.ts";
import { useItemsPresenter } from "./presenter.ts";
import type { ItemMaster, ExploreMaster } from "../../types/masters.ts";
import type { EarningItem, ConsumingItem, ItemExploreRelation } from "../../types/relations.ts";
import { fetchMaster, fetchRelation, saveMaster, saveRelation } from "../../api/client.ts";

vi.mock("../../api/client.ts");

const itemsMock: ItemMaster[] = [
	{
		id: 1,
		item_id: 100,
		DisplayName: "りんご",
		Description: "",
		Price: 100,
		MaxStock: 10,
		Attraction: 1,
		PurchaseProb: 0.1,
	},
	{
		id: 2,
		item_id: 101,
		DisplayName: "黄金りんご",
		Description: "",
		Price: 200,
		MaxStock: 10,
		Attraction: 2,
		PurchaseProb: 0.2,
	},
];

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
];

const earningItemsMock: EarningItem[] = [];
const consumingItemsMock: ConsumingItem[] = [];
const itemExploresMock: ItemExploreRelation[] = [];

const fetchMasterMock = vi.mocked(fetchMaster);
const fetchRelationMock = vi.mocked(fetchRelation);
const saveMasterMock = vi.mocked(saveMaster);
const saveRelationMock = vi.mocked(saveRelation);

beforeEach(() => {
	fetchMasterMock.mockImplementation(async (type) => {
		if (type === "items") return itemsMock;
		if (type === "explores") return exploresMock;
		return [];
	});
	fetchRelationMock.mockImplementation(async (type) => {
		if (type === "earning-items") return earningItemsMock;
		if (type === "consuming-items") return consumingItemsMock;
		if (type === "item-explores") return itemExploresMock;
		return [];
	});
	saveMasterMock.mockResolvedValue();
	saveRelationMock.mockResolvedValue();
	setupWindowMock();
});

afterEach(() => {
	vi.clearAllMocks();
});

async function renderPresenter(initialPath = "/items") {
	const result = await renderHookWithRouter(useItemsPresenter, {
		initialPath,
		routePath: "/items",
	});
	await flushPromises();
	return result;
}

describe("useItemsPresenter", () => {
	it("URLパラメータselectedから初期選択を復元する", async () => {
		const { getResult } = await renderPresenter("/items?selected=101");
		expect(getResult().selectedId).toBe(2);
	});

	it("onSelectで選択とクエリパラメータを同期する", async () => {
		const { getResult, router } = await renderPresenter();

		await getResult().onSelect(1);
		await flushPromises();
		expect(getResult().selectedId).toBe(1);
		expect(router.state.location.search).toBe("?selected=100");

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
		expect(router.state.location.search).toBe("?selected=102");
		expect(getResult().data.find((item) => item.item_id === 102)).toBeTruthy();
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
