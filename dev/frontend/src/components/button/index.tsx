import { ButtonView } from "./view";

type Props = {
	className?: string;
	isActive?: boolean;
	onClick?: () => void;
	children: React.ReactNode;
	disable?: boolean;
};

export const Button = ({
	children,
	className,
	isActive,
	onClick,
	disable,
}: Props) => {
	return (
		<ButtonView
			className={className}
			isActive={isActive}
			onClick={onClick}
			disable={disable}
		>
			{children}
		</ButtonView>
	);
};
