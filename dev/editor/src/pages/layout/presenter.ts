import { useCallback, useState } from "react";

export function useLayoutPresenter() {
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const onSave = useCallback(async () => {
		setIsSaving(true);
		// グローバルな保存イベントを発火
		window.dispatchEvent(new CustomEvent("editor:save"));
		// 保存完了を待機（各ページが保存完了後にイベントを発火）
		await new Promise<void>((resolve) => {
			const handler = () => {
				window.removeEventListener("editor:save-complete", handler);
				resolve();
			};
			window.addEventListener("editor:save-complete", handler);
			// タイムアウト
			setTimeout(() => {
				window.removeEventListener("editor:save-complete", handler);
				resolve();
			}, 5000);
		});
		setIsSaving(false);
		setHasChanges(false);
	}, []);

	const onReload = useCallback(() => {
		window.dispatchEvent(new CustomEvent("editor:reload"));
	}, []);

	// 変更検知用のリスナーを設定
	useState(() => {
		const handler = () => setHasChanges(true);
		window.addEventListener("editor:change", handler);
		return () => window.removeEventListener("editor:change", handler);
	});

	return {
		onSave,
		onReload,
		isSaving,
		hasChanges,
	};
}
