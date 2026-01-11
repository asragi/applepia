type Props = {
	coverImage: string;
	name: string;
	subtitle: string;
};

export const ThumbnailView = ({ coverImage, name, subtitle }: Props) => {
	return (
		<div className="relative aspect-[3.5/1] w-full overflow-hidden">
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${coverImage})` }}
			/>
			<div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-black/20" />
			<div className="relative z-10 h-full flex flex-col p-6 text-base-100 text-right">
				<div className="flex justify-end">
					<h2 className="text-2xl md:text-3xl font-semibold">{name}</h2>
				</div>
				<div className="mt-auto">
					<p className="text-xs text-white/80">{subtitle}</p>
				</div>
			</div>
		</div>
	);
};
