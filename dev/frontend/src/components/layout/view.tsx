import { Outlet } from "react-router";
import {
	FOOTER_HEIGHT_PADDING,
	HEADER_HEIGHT_PADDING,
} from "../../constants/layout";
import { Footer } from "../footer/view";
import { Header } from "../header";
import { Main } from "../main/view";

export const Layout = () => {
	return (
		<div
			className={`min-h-screen flex flex-col bg-base-200 ${HEADER_HEIGHT_PADDING} ${FOOTER_HEIGHT_PADDING}`}
		>
			<Header />
			<Main>
				<Outlet />
			</Main>
			<Footer />
		</div>
	);
};
