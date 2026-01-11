import { NavLink } from "react-router";
import { Card } from "../../../components/card";
import { Carousel } from "../../../components/carousel";
import { Inset } from "../../../components/inset";
import { ItemDetailInModal } from "../../../components/item-detail";
import { ItemIcon } from "../../../components/item-icon";
import { LabeledText } from "../../../components/labeled-text";
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

export const ItemExploreResultView = ({
	history,
	currentLabel,
	earningItems,
	consumingItems,
}: Props) => {
	return (
		<PageLayout history={history} currentLabel={currentLabel}>
			<div className="flex flex-col w-full">
				<Card>
					<ItemDetailInModal />
					<div>
						<h1>月面探索</h1>
						<div className="text-xs">
							月に探索に出かけます。未知の何かが見つかるかも......
						</div>
					</div>
					<div>
						<h2>入手アイテム</h2>
						<Inset>
							<Carousel>
								{earningItems.map((item, index) => (
									<div key={String(index)}>
										<ItemIcon icon={item.icon} />
									</div>
								))}
							</Carousel>
						</Inset>
					</div>

					<div>
						<h2>消費アイテム</h2>
						<Inset>
							<Carousel>
								{consumingItems.map((item, index) => (
									<div key={String(index)} className="relative">
										<ItemIcon icon={item.icon} />
										<div className="absolute bottom-0 right-0 text-xs bg-white rounded-full px-1">
											x{item.count}
										</div>
									</div>
								))}
							</Carousel>
						</Inset>
					</div>

					<div>
						<LabeledText label="費用" text="123,456,789,000 G" />
						<LabeledText label="消費スタミナ" text="3600" />
					</div>

					<NavLink to="/inventory" className="btn">
						OK
					</NavLink>
				</Card>
			</div>
		</PageLayout>
	);
};
