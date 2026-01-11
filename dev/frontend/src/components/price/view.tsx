import { LabeledText } from "../labeled-text";

export const PriceView = ({ price }: { price: number }) => {
	return <LabeledText label="売価" text={`${price.toLocaleString()} G`} />;
};
