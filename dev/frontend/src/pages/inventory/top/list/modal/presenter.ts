import { useCallback, useState } from "react";
import { useModal } from "../../../../../components/modal";
import type { Mode } from "./mode";

export const useInventoryModalPresenter = () => {
	const { renderModal, showModal } = useModal();
	const [mode, setMode] = useState<Mode>("detail");

	const onClickExplore = useCallback(() => {
		setMode("explore");
	}, []);

	const showModalWrapper = useCallback(() => {
		setMode("detail");
		showModal();
	}, [showModal]);

	return { renderModal, showModal: showModalWrapper, onClickExplore, mode };
};
