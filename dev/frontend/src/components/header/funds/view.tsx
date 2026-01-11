import { LabeledText } from "../../labeled-text";

export type ViewProps = {
	funds: number;
};

export const FundsDisplay = ({ funds }: ViewProps) => {
	return <LabeledText label="資金" text={`${funds.toLocaleString()} G`} />;
};
