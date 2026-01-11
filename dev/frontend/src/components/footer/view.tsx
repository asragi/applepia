import { NavLink } from "react-router";

const footerItems = [
	{ label: "店舗", to: "/dashboard" },
	{ label: "倉庫", to: "/inventory" },
	{ label: "探索", to: "/explore" },
	{ label: "他店", to: "/shops" },
	{ label: "データ", to: "/data" },
	{ label: "へんな石", to: "/purchase" },
];

export const Footer = () => {
	return (
		<footer className="fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 z-40 h-12 flex justify-center">
			<nav className="tabs tabs-box">
				{footerItems.map(({ label, to }) => (
					<NavLink
						key={label}
						to={to}
						className={({ isActive }) => `tab ${isActive ? "tab-active" : ""}`}
					>
						{label}
					</NavLink>
				))}
			</nav>
		</footer>
	);
};
