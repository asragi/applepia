import { NavLink } from "react-router";
import { PageLayout } from "../../layout";
import { Thumbnail } from "../thumbnail";

type Destination = {
	id: string;
	name: string;
	subtitle: string;
	coverImage: string;
	activities: { id: string; title: string }[];
};

type Props = {
	destinations: Destination[];
};

export const ExploreView = ({ destinations }: Props) => {
	return (
		<PageLayout history={[]} currentLabel="探索">
			<ul className="space-y-4">
				{destinations.map((destination) => (
					<li key={destination.id}>
						<NavLink
							to={`/explore/${destination.id}`}
							className="block bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden transition hover:border-primary/40"
						>
							<Thumbnail
								name={destination.name}
								subtitle={destination.subtitle}
								coverImage={destination.coverImage}
							/>
						</NavLink>
					</li>
				))}
			</ul>
		</PageLayout>
	);
};
