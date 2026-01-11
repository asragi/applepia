export const View = ({
	children,
	infoClass,
	render,
	visible,
}: {
	children: React.ReactNode;
	infoClass: string;
	render: boolean;
	visible: boolean;
}) => {
	if (!render) return null;
	return (
		<div className="toast toast-top top-32 toast-end">
			<div
				className={`alert transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"} ${infoClass}`}
			>
				{children}
			</div>
		</div>
	);
};
