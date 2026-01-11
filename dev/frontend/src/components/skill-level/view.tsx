type Props = {
	level: string;
};

export const SkillLevelView = ({ level }: Props) => {
	return (
		<span className="text-sm text-base-content/70 whitespace-nowrap">
			Lv{level}
		</span>
	);
};
