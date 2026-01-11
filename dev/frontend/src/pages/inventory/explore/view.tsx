import { ExploreCard } from "../../../components/explore-card";
import { ItemDetailInModal } from "../../../components/item-detail";
import { PageLayout } from "../../layout";

type Props = {
	history: { label: string; href: string }[];
	currentLabel: string;
	earningItems: {
		icon: string;
	}[];
	consumingItems: {
		icon: string;
		count: string;
	}[];
};

export const ItemExploreView = ({
	history,
	currentLabel,
	earningItems,
	consumingItems,
}: Props) => {
	return (
		<PageLayout history={history} currentLabel={currentLabel}>
			<ExploreCard earningItems={earningItems} consumingItems={consumingItems}>
				<ItemDetailInModal />
				<div>
					<h1>月面探索</h1>
					<div className="text-xs">
						月に探索に出かけます。未知の何かが見つかるかも......
					</div>
				</div>
			</ExploreCard>
		</PageLayout>
	);
};
