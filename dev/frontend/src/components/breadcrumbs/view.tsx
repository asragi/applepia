import { NavLink } from "react-router";

type Props = {
	history: { label: string; href: string }[];
	currentLabel: string;
};
export const BreadcrumbsView = ({ history, currentLabel }: Props) => {
	return (
		<div className="breadcrumbs text-sm">
			<ul>
				{history.map((item, index) => (
					<li key={String(index)}>
						<NavLink to={item.href}>{item.label}</NavLink>
					</li>
				))}
				<li>{currentLabel}</li>
			</ul>
		</div>
	);
};
