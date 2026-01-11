export const ItemIconView = ({ icon }: { icon: string }) => {
	return (
		<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
			<span>{icon}</span>
		</div>
	);
};
