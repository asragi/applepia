export const LabeledTextView = ({
	label,
	text,
	className,
}: {
	label: string;
	text: string;
	className?: string;
}) => {
	return (
		<div className={`flex justify-between gap-x-1 items-end ${className}`}>
			<span className="text-xs text-left text-nowrap">{label}</span>
			<span className="text-sm text-right text-nowrap">{text}</span>
		</div>
	);
};
