import { useEffect, useState } from "react";
import type { InfoType } from "./types";

const infoTypeToClass = (infoType: InfoType) => {
	const classMap: Record<InfoType, string> = {
		info: "alert-info",
		success: "alert-success",
		warning: "alert-warning",
		error: "alert-error",
	};
	return classMap[infoType];
};

const ALERT_TIMEOUT = 3000;

export const usePresenter = ({ infoType }: { infoType: InfoType }) => {
	const [visible, setVisible] = useState(true);
	const [render, setRender] = useState(true);

	useEffect(() => {
		const hideTimer = setTimeout(() => {
			setVisible(false);
		}, ALERT_TIMEOUT - 500);

		const removeTimer = setTimeout(() => {
			setRender(false);
		}, ALERT_TIMEOUT);

		return () => {
			clearTimeout(hideTimer);
			clearTimeout(removeTimer);
		};
	}, []);

	return { infoClass: infoTypeToClass(infoType), render, visible };
};
