import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { InventoryItem } from "./list/type";
import type { InventoryCategory } from "./type";

type Props = {
	items: InventoryItem[];
	categories: InventoryCategory[];
};

const ITEMS_PER_PAGE = 8;

export const useInventoryTopPresenter = ({ items, categories }: Props) => {
	// Category
	const [activeCategoryId, setActiveCategoryId] = useState<string>(
		categories[0]?.id ?? "all",
	);
	const [currentPage, setCurrentPage] = useState(1);

	const filteredItems = useMemo(() => {
		if (activeCategoryId === "all") {
			return items;
		}
		return items.filter((item) => item.categoryId === activeCategoryId);
	}, [activeCategoryId, items]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
	);

	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredItems.slice(start, start + ITEMS_PER_PAGE);
	}, [currentPage, filteredItems]);

	const changePage = (page: number) => {
		setCurrentPage(page);
	};

	const selectCategory = (categoryId: string) => {
		setActiveCategoryId(categoryId);
		setCurrentPage(1);
	};

	// toast
	const location = useLocation();
	const showToast = Boolean(location.state?.success);

	return {
		categories,
		activeCategoryId,
		items: paginatedItems,
		currentPage,
		totalPages,
		changePage,
		selectCategory,
		showToast,
	};
};
