export type ViewProps = {
	storeName: string;
};

export const StoreName = ({ storeName }: ViewProps) => {
	return <div className="font-bold">{storeName}</div>;
};
