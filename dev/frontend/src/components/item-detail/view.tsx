import { ItemIcon } from "../item-icon";
import { ItemName } from "../item-name";
import { RegularPrice } from "../regular-price";
import { ItemStock } from "../stock";

export const ItemDetailInModalView = () => {
	return (
		<div className="flex gap-2 mb-2">
			<ItemIcon icon="🚀" />
			<div className="flex justify-between grow">
				<div>
					<ItemName name="ロケット" />
				</div>
				<div className="grow flex flex-col max-w-40">
					<RegularPrice price={150000000} />
					<ItemStock stock={5000} />
				</div>
			</div>
		</div>
	);
};
