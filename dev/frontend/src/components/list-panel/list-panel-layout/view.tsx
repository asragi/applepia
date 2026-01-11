export const View = ({ children }: { children: React.ReactNode }) => {
	return (
		<li className="flex flex-col bg-base-100 border border-base-300 rounded-lg shadow-sm">
			{children}
		</li>
	);
};
