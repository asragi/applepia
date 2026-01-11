import { Breadcrumbs } from "../../components/breadcrumbs";

type Props = {
	history: { label: string; href: string }[];
	currentLabel: string;
	children: React.ReactNode;
};

export const View = ({ children, history, currentLabel }: Props) => {
	return (
		<section id="page-layout" className={`flex flex-col grow gap-2`}>
			<header>
				<Breadcrumbs history={history} currentLabel={currentLabel} />
			</header>
			<main id="page-layout-main" className={`grow flex flex-col w-full`}>
				{children}
			</main>
		</section>
	);
};
