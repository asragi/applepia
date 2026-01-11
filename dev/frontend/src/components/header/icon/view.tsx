export type ViewProps = {
	icon: string;
};

export const PlayerIcon = ({ icon }: ViewProps) => {
	return (
		<div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
			<span className="text-4xl">{icon}</span>
		</div>
	);
};
