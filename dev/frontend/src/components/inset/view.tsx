export const InsetView = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="rounded-md shadow-inner bg-base-200 p-2">{children}</div>
	);
};
