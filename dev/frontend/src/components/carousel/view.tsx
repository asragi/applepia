export const CarouselView = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex overflow-x-auto whitespace-nowrap gap-2">
			{children}
		</div>
	);
};
