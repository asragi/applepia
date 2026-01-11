import { Breadcrumbs } from "../../components/breadcrumbs";
import { ListPanel } from "../../components/list-panel/list-panel-navlink";
import { ListPanelContainer } from "../../components/list-panel-container";
import { SkillInformation } from "../../components/skill-information";

type Skill = {
	id: string;
	icon: string;
	name: string;
	level: string;
	progress: number;
	experience: {
		current: number;
		max: number;
	};
};

type Props = {
	history: { label: string; href: string }[];
	currentLabel: string;
	skills: Skill[];
};

export const DataPageView = ({ history, currentLabel, skills }: Props) => {
	return (
		<section className="flex flex-col gap-4 grow h-full">
			<header>
				<Breadcrumbs history={history} currentLabel={currentLabel} />
			</header>

			<main className="grow flex flex-col">
				<ListPanelContainer>
					{skills.map((skill) => (
						<ListPanel key={skill.id} to={`/data/skills/${skill.id}`}>
							<SkillInformation
								icon={skill.icon}
								name={skill.name}
								level={skill.level}
								experience={{
									current: skill.experience.current,
									max: skill.experience.max,
									progress: skill.progress,
								}}
							/>
						</ListPanel>
					))}
				</ListPanelContainer>

				{skills.length === 0 ? (
					<div className="text-center text-sm text-base-content/70 py-8">
						習得済みのスキルはありません
					</div>
				) : null}
			</main>
		</section>
	);
};
