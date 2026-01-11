type ToastViewProps = {
	message: string;
	type: "success" | "error" | "info";
	onClose: () => void;
};

export function ToastView({ message, type, onClose }: ToastViewProps) {
	const alertClass = {
		success: "alert-success",
		error: "alert-error",
		info: "alert-info",
	}[type];

	return (
		<div className="toast toast-end toast-top z-50">
			<div className={`alert ${alertClass}`}>
				<span>{message}</span>
				<button type="button" className="btn btn-ghost btn-xs" onClick={onClose}>
					✕
				</button>
			</div>
		</div>
	);
}
