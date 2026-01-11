import { DataPageView } from "./view";

const calcProgress = (current: number, max: number) =>
	max === 0 ? 0 : Math.min(100, (current / max) * 100);

const skills = [
	{
		id: "chakra-control",
		icon: "🌀",
		name: "チャクラコントロール",
		level: "MAX",
		experience: { current: 1500, max: 1500 },
		progress: calcProgress(1500, 1500),
	},
	{
		id: "vision",
		icon: "👁️",
		name: "観察眼",
		level: "42",
		experience: { current: 820, max: 1200 },
		progress: calcProgress(820, 1200),
	},
	{
		id: "craftsmanship",
		icon: "🛠️",
		name: "匠の技",
		level: "37",
		experience: { current: 560, max: 900 },
		progress: calcProgress(560, 900),
	},
	{
		id: "taste",
		icon: "👅",
		name: "味覚センス",
		level: "12",
		experience: { current: 140, max: 300 },
		progress: calcProgress(140, 300),
	},
	{
		id: "speed",
		icon: "⚡",
		name: "高速調理",
		level: "27",
		experience: { current: 340, max: 700 },
		progress: calcProgress(340, 700),
	},
];

const history = [{ label: "データ", href: "/data" }];
const currentLabel = "スキル";

export const DataPage = () => (
	<DataPageView history={history} currentLabel={currentLabel} skills={skills} />
);
