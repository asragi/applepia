import { useRangePresenter } from "./presenter";
import { RangeView } from "./view";

type Props = {
	min: number;
	max: number;
	step?: number;
	labels?: string[];
	initialValue: number;
	withBar?: boolean;
};

export const Range = ({ initialValue, ...props }: Props) => {
	const { value, onChangeValue } = useRangePresenter({ initialValue });
	return <RangeView {...props} value={value} onChangeValue={onChangeValue} />;
};
