import { useNavigate } from "react-router";

export function useNavigateToRecord() {
	const navigate = useNavigate();

	return (
		targetType: "items" | "skills" | "explores" | "stages",
		masterId: number
	) => {
		navigate(`/${targetType}?selected=${masterId}`);
	};
}
