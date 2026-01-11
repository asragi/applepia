import { LabeledText } from "../labeled-text";

export const RegularPriceView = ({ price }: { price: string }) => {
	return <LabeledText label="定価" text={`${price} G`} />;
};
