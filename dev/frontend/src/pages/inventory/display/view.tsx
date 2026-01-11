import { useState } from "react";
import { Button } from "../../../components/button";
import { Card } from "../../../components/card";
import { ItemDetailInModal } from "../../../components/item-detail";
import { ItemListMini } from "../../../components/item-list-mini";
import { NumberInputField } from "../../../components/number-input-field";
import { Range } from "../../../components/range";
import { PageLayout } from "../../layout";

type Props = {
	history: { label: string; href: string }[];
	currentLabel: string;
	displayItems: {
		id: string;
		name: string;
		icon: string;
		price: number;
		stock: number;
		soldThisTerm: number;
	}[];
	numberInputLabel: string;
	onSubmit: () => void;
	loading: boolean;
};

const PRICE_MAX = 999999999;

export const DisplayPageView = ({
	history,
	currentLabel,
	displayItems,
	numberInputLabel,
	onSubmit,
	loading,
}: Props) => {
	const [activeIndex, setActiveIndex] = useState(
		displayItems.length > 0 ? 0 : -1,
	);

	return (
		<PageLayout history={history} currentLabel={currentLabel}>
			<div className="flex flex-col w-full">
				<Card>
					<ItemDetailInModal />
					<div className="flex flex-col gap-1">
						<NumberInputField label={numberInputLabel} max={PRICE_MAX} />
						<div className="flex gap-1">
							<div className="flex items-center">
								<span className="text-nowrap">定価 ×</span>
							</div>
							<Range
								min={0}
								max={4}
								initialValue={2}
								labels={["0.6", "0.8", "1", "1.2", "1.4"]}
							/>
						</div>
					</div>
					<div>
						<h1>陳列先</h1>
						<ItemListMini
							items={displayItems}
							selectedIndex={activeIndex}
							onSelect={setActiveIndex}
						/>
					</div>
					<Button onClick={onSubmit} disable={loading}>
						陳列する
					</Button>
				</Card>
			</div>
		</PageLayout>
	);
};
