import { SkillExperience } from "../skill-experience";
import { SkillIcon } from "../skill-icon";
import { SkillLevel } from "../skill-level";
import { SkillName } from "../skill-name";

type Props = {
	icon: string;
	name: string;
	level: string;
	experience: {
		current: number;
		max: number;
		progress: number;
	};
};

export const SkillInformationView = ({
	icon,
	name,
	level,
	experience,
}: Props) => {
	return (
		<div className="w-full flex gap-3 items-center">
			<SkillIcon icon={icon} />
			<div className="flex flex-col flex-1 gap-1">
				<div className="flex items-center justify-between gap-2">
					<SkillName name={name} />
					<SkillLevel level={level} />
				</div>
				<SkillExperience
					current={experience.current}
					max={experience.max}
					progress={experience.progress}
				/>
			</div>
		</div>
	);
};
