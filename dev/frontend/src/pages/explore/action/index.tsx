import { useExploreActionPresenter } from "./presenter";
import { ExploreActionView } from "./view";

const destinations = [
	{
		id: "misty-orchard",
		name: "霧の果樹園",
		subtitle: "夜明け前、山麓の霧が晴れるタイミング",
		activities: [
			{
				id: "mist-apple",
				title: "リンゴの朝露採集",
				description: "朝露を集めて特選りんごの香りを閉じ込める。",
				cost: "12,000 G",
				stamina: "120",
				earningItems: [{ icon: "🍎" }, { icon: "🍯" }, { icon: "✨" }],
				consumingItems: [
					{ icon: "🪣", count: "1" },
					{ icon: "🧺", count: "2" },
				],
			},
			{
				id: "branch",
				title: "霧木の枝集め",
				description: "霧木の枝を集めて香木素材を確保する。",
				cost: "8,500 G",
				stamina: "90",
				earningItems: [{ icon: "🪵" }, { icon: "🍃" }],
				consumingItems: [{ icon: "🪓", count: "1" }],
			},
			{
				id: "beacon",
				title: "霧灯の設置",
				description: "霧の流れを誘導して採集効率を高める。",
				cost: "15,200 G",
				stamina: "150",
				earningItems: [{ icon: "🪔" }, { icon: "🍎" }],
				consumingItems: [{ icon: "🔧", count: "1" }],
			},
		],
	},
	{
		id: "river-workshop",
		name: "渓流沿いのアトリエ",
		subtitle: "水車が回り続けるクラフト拠点",
		activities: [
			{
				id: "herb-dry",
				title: "ハーブ乾燥",
				description: "風通しの良い棚で香草を乾燥させる。",
				cost: "6,800 G",
				stamina: "70",
				earningItems: [{ icon: "🌿" }, { icon: "🧂" }],
				consumingItems: [{ icon: "🧺", count: "1" }],
			},
			{
				id: "branch-cut",
				title: "流木カット",
				description: "流木を切り出して素材を整える。",
				cost: "9,200 G",
				stamina: "100",
				earningItems: [{ icon: "🪵" }, { icon: "🪚" }],
				consumingItems: [{ icon: "🪓", count: "1" }],
			},
			{
				id: "apple-press",
				title: "アップルプレス",
				description: "果汁を搾って濃縮素材を作る。",
				cost: "10,500 G",
				stamina: "110",
				earningItems: [{ icon: "🍎" }, { icon: "🧪" }],
				consumingItems: [{ icon: "⚙️", count: "1" }],
			},
		],
	},
	{
		id: "star-dune",
		name: "星降る砂丘",
		subtitle: "夜になると砂粒が光を帯びる不思議なエリア",
		activities: [
			{
				id: "stardust",
				title: "砂金と星砂の採取",
				description: "砂丘に混じる光る砂を採取する。",
				cost: "18,500 G",
				stamina: "180",
				earningItems: [{ icon: "✨" }, { icon: "🪨" }],
				consumingItems: [{ icon: "⛏️", count: "1" }],
			},
			{
				id: "meteor",
				title: "流星の欠片探索",
				description: "流星の欠片を探し出して素材化する。",
				cost: "24,000 G",
				stamina: "220",
				earningItems: [{ icon: "☄️" }, { icon: "💎" }],
				consumingItems: [{ icon: "🧭", count: "1" }],
			},
			{
				id: "camp",
				title: "キャンプ設営",
				description: "長期探索の拠点を作る。",
				cost: "9,000 G",
				stamina: "80",
				earningItems: [{ icon: "⛺" }, { icon: "🔥" }],
				consumingItems: [{ icon: "🪵", count: "2" }],
			},
		],
	},
];

export const ExploreActionPage = () => {
	const { destination, action } = useExploreActionPresenter({ destinations });

	if (!destination || !action) {
		return null;
	}

	const history = [
		{ label: "探索", href: "/explore" },
		{ label: destination.name, href: `/explore/${destination.id}` },
	];
	const currentLabel = action.title;

	return (
		<ExploreActionView
			destination={destination}
			action={action}
			history={history}
			currentLabel={currentLabel}
		/>
	);
};
