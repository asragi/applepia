type Props = {
	className?: string;
	isActive?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
	disable?: boolean;
};

export const ButtonView = ({
	children,
	className,
	isActive,
	onClick,
	disable,
}: Props) => {
	return (
		<button
			type="button"
			className={`btn ${className ?? ""} ${isActive ? "btn-accent" : ""}`}
			onClick={onClick}
			disabled={disable}
		>
			{children}
		</button>
	);
};
