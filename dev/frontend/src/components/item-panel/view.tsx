import { ItemIcon } from "../item-icon";
import { ItemName } from "../item-name";
import { ListPanel } from "../list-panel/list-panel-navlink";
import { Price } from "../price";
import { SoldThisTerm } from "../sold-this-term";
import { ItemStock } from "../stock";
import type { ItemPanelProps } from "./type";
import "./styles.css";

export const ItemView = ({
	name,
	icon,
	price,
	stock,
	soldThisTerm,
	to,
}: ItemPanelProps) => {
	return (
		<ListPanel to={to}>
			<ItemIcon icon={icon} />
			<div
				id="list-panel"
				className="list-panel flex-1 grid grid-cols-2 grid-rows-2 gap-x-4 text-sm"
			>
				<ItemName name={name} />
				<Price price={price} />
				{soldThisTerm ? <SoldThisTerm soldThisTerm={soldThisTerm} /> : null}
				<ItemStock stock={stock} />
			</div>
		</ListPanel>
	);
};
