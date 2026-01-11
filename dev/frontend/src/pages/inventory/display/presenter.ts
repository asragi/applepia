import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { sleep } from "../../../utils/sleep";

export const usePresenter = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const onSubmit = useCallback(() => {
		setLoading(true);
		void sleep(1000, { success: true }).then((response) => {
			setLoading(false);
			navigate("/inventory", { state: { success: response.success } });
		});
	}, [navigate]);

	return { loading, onSubmit };
};
