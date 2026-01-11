import { ExploreView } from "./view";

const destinations = [
	{
		id: "misty-orchard",
		name: "霧の果樹園",
		subtitle: "夜明け前、山麓の霧が晴れるタイミング",
		coverImage:
			"https://images.unsplash.com/photo-1472740368864-216b58e96f18?auto=format&fit=crop&w=1400&q=80",
		activities: [
			{ id: "mist-apple", title: "リンゴの朝露採集" },
			{ id: "branch", title: "霧木の枝集め" },
			{ id: "beacon", title: "霧灯の設置" },
		],
	},
	{
		id: "river-workshop",
		name: "渓流沿いのアトリエ",
		subtitle: "水車が回り続けるクラフト拠点",
		coverImage:
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
		activities: [
			{ id: "herb-dry", title: "ハーブ乾燥" },
			{ id: "branch-cut", title: "流木カット" },
			{ id: "apple-press", title: "アップルプレス" },
		],
	},
	{
		id: "star-dune",
		name: "星降る砂丘",
		subtitle: "夜になると砂粒が光を帯びる不思議なエリア",
		coverImage:
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
		activities: [
			{ id: "stardust", title: "砂金と星砂の採取" },
			{ id: "meteor", title: "流星の欠片探索" },
			{ id: "camp", title: "キャンプ設営" },
		],
	},
];

export const ExplorePage = () => {
	return <ExploreView destinations={destinations} />;
};
