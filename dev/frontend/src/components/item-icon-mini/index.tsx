import { View } from "./view";

type Props = {
	icon: string;
};

export const ItemIconMini = ({ icon }: Props) => {
	return <View icon={icon} />;
};
