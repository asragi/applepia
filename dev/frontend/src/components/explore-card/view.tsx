import { NavLink } from "react-router";
import { Card } from "../card";
import { Carousel } from "../carousel";
import { Inset } from "../inset";
import { ItemIcon } from "../item-icon";
import { LabeledText } from "../labeled-text";
import { NumberInput } from "../number-input";

type Props = {
	children: React.ReactNode;
	earningItems: {
		icon: string;
	}[];
	consumingItems: {
		icon: string;
		count: string;
	}[];
};

export const View = ({ children, earningItems, consumingItems }: Props) => {
	return (
		<Card>
			{children}
			<div>
				<h2>入手する可能性のあるアイテム</h2>
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
				<h2>消費する可能性のあるアイテム</h2>
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

			<div className="flex gap-6 items-center">
				<NumberInput label="回数" />
				<NavLink to="/inventory/explore/result" className="btn">
					探検する
				</NavLink>
			</div>
		</Card>
	);
};
