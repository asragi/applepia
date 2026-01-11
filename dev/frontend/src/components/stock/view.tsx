import { LabeledText } from "../labeled-text";

export const StockView = ({ stock }: { stock: number }) => {
	const text = `${stock} 個`;
	return <LabeledText label="在庫数" text={text} className="stock" />;
};
