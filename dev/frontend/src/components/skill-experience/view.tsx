type Props = {
	current: number;
	max: number;
	progress: number;
};

export const SkillExperienceView = ({ current, max, progress }: Props) => {
	return (
		<div>
			<div className="flex justify-between text-xs text-base-content/60">
				<span>経験値</span>
				<span>
					{current}/{max}
				</span>
			</div>
			<div className="h-2 bg-base-200 rounded-full overflow-hidden">
				<div className="h-full bg-primary" style={{ width: `${progress}%` }} />
			</div>
		</div>
	);
};
