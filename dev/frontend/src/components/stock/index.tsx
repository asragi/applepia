import { StockView } from "./view";

export const ItemStock = ({ stock }: { stock: number }) => {
	return <StockView stock={stock} />;
};
