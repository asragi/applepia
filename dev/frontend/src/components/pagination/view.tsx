type Props = {
	currentPage: number;
	totalPages: number;
	changePage: (page: number) => void;
};

export const PaginationView = ({
	currentPage,
	totalPages,
	changePage,
}: Props) => {
	return (
		<footer className="flex justify-center p-4">
			<div className="join">
				{Array.from({ length: totalPages }, (_, i) => {
					const number = i + 1;
					return (
						<button
							type="button"
							key={String(number)}
							onClick={() => changePage(number)}
							className={`join-item btn ${
								number === currentPage ? "btn-active" : ""
							}`}
						>
							{number}
						</button>
					);
				})}
			</div>
		</footer>
	);
};
