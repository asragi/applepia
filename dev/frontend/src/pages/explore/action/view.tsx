import { ExploreCard } from "../../../components/explore-card";
import { PageLayout } from "../../layout";

type Item = {
	icon: string;
};

type ConsumingItem = {
	icon: string;
	count: string;
};

type Destination = {
	id: string;
	name: string;
	subtitle: string;
};

type Action = {
	title: string;
	description: string;
	cost: string;
	stamina: string;
	earningItems: Item[];
	consumingItems: ConsumingItem[];
};

type Props = {
	destination: Destination;
	action: Action;
	history: { label: string; href: string }[];
	currentLabel: string;
};

export const ExploreActionView = ({
	destination,
	action,
	history,
	currentLabel,
}: Props) => {
	return (
		<PageLayout history={history} currentLabel={currentLabel}>
			<ExploreCard
				earningItems={action.earningItems}
				consumingItems={action.consumingItems}
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-xl font-semibold">{destination.name}</h1>
						<p className="text-xs text-base-content/70">
							{destination.subtitle}
						</p>
					</div>
				</div>

				<div>
					<h2 className="text-lg font-semibold">{action.title}</h2>
					<p className="text-sm text-base-content/80">{action.description}</p>
				</div>
			</ExploreCard>
		</PageLayout>
	);
};
