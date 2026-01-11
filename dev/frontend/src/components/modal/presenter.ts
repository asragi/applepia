import { useCallback, useRef } from "react";

export const useModalPresenter = () => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const showModal = useCallback(() => {
		modalRef.current?.showModal();
	}, []);
	return { showModal, modalRef };
};
