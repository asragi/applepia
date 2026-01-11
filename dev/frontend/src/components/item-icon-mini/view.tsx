export const View = ({ icon }: { icon: string }) => {
	return (
		<div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
			<span>{icon}</span>
		</div>
	);
};
