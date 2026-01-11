type Props = {
	price: number;
};
export const useRegularPricePresenter = ({ price }: Props) => {
	const formatPrice = (price: number): string => {
		return price.toLocaleString();
	};
	return {
		price: formatPrice(price),
	};
};
