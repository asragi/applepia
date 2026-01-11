export const CardView = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="card bg-base-100 shadow-sm">
			<div className="card-body gap-4">{children}</div>
		</div>
	);
};
