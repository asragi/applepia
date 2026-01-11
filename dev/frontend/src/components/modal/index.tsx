import { useCallback } from "react";
import { useModalPresenter } from "./presenter";
import { ModalView } from "./view";

export const useModal = () => {
	const { showModal, modalRef } = useModalPresenter();
	const renderModal = useCallback(
		({ children }: { children: React.ReactNode }) => {
			return <ModalView modalRef={modalRef}>{children}</ModalView>;
		},
		[modalRef],
	);
	return { renderModal, showModal };
};
