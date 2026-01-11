import { NavLink } from "react-router";
import { Card } from "../../../components/card";
import { ItemDetailInModal } from "../../../components/item-detail";
import { ListPanel } from "../../../components/list-panel/list-panel-navlink";
import { ListPanelContainer } from "../../../components/list-panel-container";
import { PageLayout } from "../../layout";

type Explore = {
	label: string;
	id: string;
};

type Props = {
	history: { label: string; href: string }[];
	currentLabel: string;
	explores: Explore[];
};

export const ItemDetailView = ({ history, currentLabel, explores }: Props) => {
	return (
		<PageLayout history={history} currentLabel={currentLabel}>
			<div className="flex flex-col w-full">
				<Card>
					<ItemDetailInModal />
					<div className="text-xs mb-4">あらゆる科学と努力の結晶</div>
					<div id="explore-list">
						<ListPanelContainer>
							{explores.map((explore) => (
								<ListPanel
									key={explore.id}
									to={`/inventory/explore/${explore.id}`}
								>
									{explore.label}
								</ListPanel>
							))}
						</ListPanelContainer>
					</div>
					<NavLink to="/inventory/display/42" className="mt-4 btn">
						陳列する
					</NavLink>
				</Card>
			</div>
		</PageLayout>
	);
};
