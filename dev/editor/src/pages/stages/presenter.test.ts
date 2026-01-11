import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHookWithRouter, flushPromises } from "../../test-utils/renderHookWithRouter.ts";
import { setupWindowMock } from "../../test-utils/window.ts";
import { useStagesPresenter } from "./presenter.ts";
import type { StageMaster } from "../../types/masters.ts";
import { fetchMaster, saveMaster } from "../../api/client.ts";

vi.mock("../../api/client.ts");

const stagesMock: StageMaster[] = [
	{ id: 1, stage_id: 101, display_name: "草原", description: "" },
	{ id: 2, stage_id: 102, display_name: "洞窟", description: "" },
];

const fetchMasterMock = vi.mocked(fetchMaster);
const saveMasterMock = vi.mocked(saveMaster);

beforeEach(() => {
	fetchMasterMock.mockImplementation(async (type) => {
		if (type === "stages") return stagesMock;
		return [];
	});
	saveMasterMock.mockResolvedValue();
	setupWindowMock();
});

afterEach(() => {
	vi.clearAllMocks();
});

async function renderPresenter(initialPath = "/stages") {
	const result = await renderHookWithRouter(useStagesPresenter, {
		initialPath,
		routePath: "/stages",
	});
	await flushPromises();
	return result;
}

describe("useStagesPresenter", () => {
	it("URLパラメータselectedから初期選択を復元する", async () => {
		const { getResult } = await renderPresenter("/stages?selected=102");
		expect(getResult().selectedId).toBe(2);
	});

	it("onSelectで選択とクエリパラメータを同期する", async () => {
		const { getResult, router } = await renderPresenter();

		await getResult().onSelect(1);
		await flushPromises();
		expect(getResult().selectedId).toBe(1);
		expect(router.state.location.search).toBe("?selected=101");

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
		expect(router.state.location.search).toBe("?selected=103");
		expect(getResult().data.find((item) => item.stage_id === 103)).toBeTruthy();
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
