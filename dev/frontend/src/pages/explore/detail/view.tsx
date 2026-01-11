import { Card } from "../../../components/card";
import { ListPanelNavLink } from "../../../components/list-panel";
import { PageLayout } from "../../layout";
import { Thumbnail } from "../thumbnail";

type Action = {
	id: string;
	title: string;
	summary: string;
	to: string;
};

type Destination = {
	name: string;
	subtitle: string;
	coverImage: string;
	description: string;
};

type Props = {
	destination: Destination;
	actions: Action[];
};

export const ExploreDetailView = ({ destination, actions }: Props) => {
	return (
		<PageLayout
			history={[{ label: "探索", href: "/explore" }]}
			currentLabel={destination.name}
		>
			<Card>
				<Thumbnail
					name={destination.name}
					subtitle={destination.subtitle}
					coverImage={destination.coverImage}
				/>
				<div className="text-sm text-base-content/80">
					{destination.description}
				</div>
				<div className="space-y-3">
					<ul className="space-y-2">
						{actions.map((action) => (
							<li key={action.id}>
								<ListPanelNavLink to={action.to}>
									<div className="flex-1">
										<p className="font-semibold">{action.title}</p>
										<p className="text-xs text-base-content/70">
											{action.summary}
										</p>
									</div>
								</ListPanelNavLink>
							</li>
						))}
					</ul>
				</div>
			</Card>
		</PageLayout>
	);
};
