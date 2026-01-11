import { useMemo } from "react";
import { useParams } from "react-router";

type Activity = {
	id: string;
	title: string;
	summary: string;
};

type Destination = {
	id: string;
	name: string;
	subtitle: string;
	coverImage: string;
	description: string;
	activities: Activity[];
};

type Props = {
	destinations: Destination[];
};

export const useExploreDetailPresenter = ({ destinations }: Props) => {
	const { destinationId } = useParams();

	const selected = useMemo(() => {
		if (!destinationId) return destinations[0];
		return destinations.find((destination) => destination.id === destinationId);
	}, [destinationId, destinations]);

	const destination = selected ?? destinations[0];

	const actions = useMemo(() => {
		if (!destination) return [];
		return destination.activities.map((activity) => ({
			id: activity.id,
			title: activity.title,
			summary: activity.summary,
			to: `/explore/${destination.id}/action/${activity.id}`,
		}));
	}, [destination]);

	return { destination, actions };
};
