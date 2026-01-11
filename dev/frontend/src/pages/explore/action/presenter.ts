import { useMemo } from "react";
import { useParams } from "react-router";

type Activity = {
	id: string;
	title: string;
	description: string;
	cost: string;
	stamina: string;
	earningItems: { icon: string }[];
	consumingItems: { icon: string; count: string }[];
};

type Destination = {
	id: string;
	name: string;
	subtitle: string;
	activities: Activity[];
};

type Props = {
	destinations: Destination[];
};

export const useExploreActionPresenter = ({ destinations }: Props) => {
	const { destinationId, actionId } = useParams();

	const destination = useMemo(() => {
		if (!destinationId) return destinations[0];
		return destinations.find((item) => item.id === destinationId);
	}, [destinationId, destinations]);

	const action = useMemo(() => {
		if (!destination) return undefined;
		if (!actionId) return destination.activities[0];
		return destination.activities.find((item) => item.id === actionId);
	}, [actionId, destination]);

	return { destination: destination ?? destinations[0], action };
};
