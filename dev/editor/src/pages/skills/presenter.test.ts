import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHookWithRouter, flushPromises } from "../../test-utils/renderHookWithRouter.ts";
import { setupWindowMock } from "../../test-utils/window.ts";
import { useSkillsPresenter } from "./presenter.ts";
import type { SkillMaster } from "../../types/masters.ts";
import { fetchMaster, saveMaster } from "../../api/client.ts";

vi.mock("../../api/client.ts");

const skillsMock: SkillMaster[] = [
	{ id: 1, SkillId: 10, DisplayName: "攻撃" },
	{ id: 2, SkillId: 11, DisplayName: "防御" },
];

const fetchMasterMock = vi.mocked(fetchMaster);
const saveMasterMock = vi.mocked(saveMaster);

beforeEach(() => {
	fetchMasterMock.mockImplementation(async (type) => {
		if (type === "skills") return skillsMock;
		return [];
	});
	saveMasterMock.mockResolvedValue();
	setupWindowMock();
});

afterEach(() => {
	vi.clearAllMocks();
});

async function renderPresenter(initialPath = "/skills") {
	const result = await renderHookWithRouter(useSkillsPresenter, {
		initialPath,
		routePath: "/skills",
	});
	await flushPromises();
	return result;
}

describe("useSkillsPresenter", () => {
	it("URLパラメータselectedから初期選択を復元する", async () => {
		const { getResult } = await renderPresenter("/skills?selected=11");
		expect(getResult().selectedId).toBe(2);
	});

	it("onSelectで選択とクエリパラメータを同期する", async () => {
		const { getResult, router } = await renderPresenter();

		await getResult().onSelect(1);
		await flushPromises();
		expect(getResult().selectedId).toBe(1);
		expect(router.state.location.search).toBe("?selected=10");

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
		expect(router.state.location.search).toBe("?selected=12");
		expect(getResult().data.find((item) => item.SkillId === 12)).toBeTruthy();
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
