type Props = {
	children: React.ReactNode;
	modalRef: React.RefObject<HTMLDialogElement | null>;
};

export const ModalView = ({ modalRef, children }: Props) => {
	return (
		<dialog id="my_modal_3" className="modal" ref={modalRef}>
			<div className="modal-box">
				<form method="dialog">
					<button
						type="submit"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					>
						✕
					</button>
				</form>
				{children}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button type="submit">close</button>
			</form>
		</dialog>
	);
};
