import { Button } from "../../../components/button";
import { Filter } from "../../../components/filter";
import { Pagination } from "../../../components/pagination";
import { Toast } from "../../../components/toast";
import {
	FOOTER_HEIGHT_PADDING,
	HEADER_HEIGHT_PADDING,
} from "../../../constants/layout";
import { PageLayout } from "../../layout";
import { List } from "./list";
import type { InventoryItem } from "./list/type";
import type { InventoryCategory } from "./type";

type Props = {
	items: InventoryItem[];
	categories: InventoryCategory[];
	activeCategoryId: string;
	currentPage: number;
	totalPages: number;
	changePage: (page: number) => void;
	selectCategory: (categoryId: string) => void;
	showToast: boolean;
};

export const InventoryView = ({
	items,
	categories,
	activeCategoryId,
	currentPage,
	totalPages,
	changePage,
	selectCategory,
	showToast,
}: Props) => {
	return (
		<>
			<PageLayout history={[]} currentLabel="倉庫">
				<div id="inventory-top" className="flex flex-col gap-2 grow">
					<div className="flex justify-end">
						<Filter>
							<div
								className={`flex flex-col gap-1 ${HEADER_HEIGHT_PADDING} ${FOOTER_HEIGHT_PADDING}`}
							>
								{categories.map((category) => (
									<li key={category.id}>
										<Button
											isActive={category.id === activeCategoryId}
											onClick={() => selectCategory(category.id)}
										>
											{category.label}
										</Button>
									</li>
								))}
							</div>
						</Filter>
					</div>
					<div className="flex flex-col grow justify-between">
						<List items={items} />
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							changePage={changePage}
						/>
					</div>
				</div>
			</PageLayout>
			{showToast && (
				<Toast infoType="success">
					<div>陳列しました</div>
				</Toast>
			)}
		</>
	);
};
