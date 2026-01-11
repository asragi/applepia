type Props = {
	icon: string;
};

export const SkillIconView = ({ icon }: Props) => {
	return (
		<div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-xl shrink-0">
			{icon}
		</div>
	);
};
