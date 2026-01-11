import { useCallback, useState } from "react";

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 99;

type Options = {
	defaultValue?: number;
	min?: number;
	max?: number;
};

export const useCounter = ({
	defaultValue = DEFAULT_MIN,
	min = DEFAULT_MIN,
	max = DEFAULT_MAX,
}: Options = {}) => {
	const clamp = useCallback(
		(value: number) => Math.min(max, Math.max(min, value)),
		[max, min],
	);

	const parseOrMin = useCallback(
		(value: string) => {
			if (value === "") {
				return min;
			}
			const parsed = Number(value);
			return Number.isNaN(parsed) ? min : parsed;
		},
		[min],
	);

	const [value, setRawValue] = useState<string>(String(defaultValue));

	const onChangeValue = useCallback(
		(rawValue: string) => {
			if (rawValue === "") {
				setRawValue("");
				return;
			}

			if (!/^\d+$/.test(rawValue)) {
				return;
			}

			const numeric = Number(rawValue);
			setRawValue(String(clamp(numeric)));
		},
		[clamp],
	);

	const onBlurInput = useCallback(() => {
		setRawValue((prev) => (prev === "" ? String(min) : prev));
	}, [min]);

	const setValue = useCallback(
		(updater: (prev: number) => number) => {
			setRawValue((prev) => {
				const numeric = parseOrMin(prev);
				const next = updater(numeric);
				return String(clamp(next));
			});
		},
		[clamp, parseOrMin],
	);

	return {
		value,
		onChangeValue,
		onBlurInput,
		setValue,
	};
};
