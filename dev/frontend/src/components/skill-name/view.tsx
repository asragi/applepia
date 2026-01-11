type Props = {
	name: string;
};

export const SkillNameView = ({ name }: Props) => {
	return <p className="font-semibold text-base leading-tight">{name}</p>;
};
