import { LabeledText } from "../../labeled-text";

export type ViewProps = {
	stones: number;
};

export const GachaDisplay = ({ stones }: ViewProps) => {
	return <LabeledText label="へんな石" text={stones.toString()} />;
};
