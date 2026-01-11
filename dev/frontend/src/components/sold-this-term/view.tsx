import { LabeledText } from "../labeled-text";

export const SoldThisTermView = ({
	soldThisTerm,
}: {
	soldThisTerm: number;
}) => {
	const text = `${soldThisTerm} 個`;
	return <LabeledText label="今期売上" text={text} />;
};
