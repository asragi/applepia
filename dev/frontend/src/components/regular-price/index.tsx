import { useRegularPricePresenter } from "./presenter";
import { RegularPriceView } from "./view";

type Props = {
	price: number;
};

export const RegularPrice = ({ price }: Props) => {
	const { price: formattedPrice } = useRegularPricePresenter({ price });
	return <RegularPriceView price={formattedPrice} />;
};
