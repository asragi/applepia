import { useExploreDetailPresenter } from "./presenter";
import { ExploreDetailView } from "./view";

const destinations = [
	{
		id: "misty-orchard",
		name: "霧の果樹園",
		subtitle: "夜明け前、山麓の霧が晴れるタイミング",
		coverImage:
			"https://images.unsplash.com/photo-1472740368864-216b58e96f18?auto=format&fit=crop&w=1400&q=80",
		description:
			"果樹園に漂う甘い霧は収穫前の兆し。朝露が濃いほど収穫量も増える。",
		activities: [
			{
				id: "mist-apple",
				title: "リンゴの朝露採集",
				summary: "朝露を集めて甘みの濃い果実を確保する。",
			},
			{
				id: "branch",
				title: "霧木の枝集め",
				summary: "霧の木から香りの強い枝を回収する。",
			},
			{
				id: "beacon",
				title: "霧灯の設置",
				summary: "灯りで霧の流れを誘導して収穫を助ける。",
			},
		],
	},
	{
		id: "river-workshop",
		name: "渓流沿いのアトリエ",
		subtitle: "水車が回り続けるクラフト拠点",
		coverImage:
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
		description: "水と木材を活かした加工が盛んなクラフト拠点。",
		activities: [
			{
				id: "herb-dry",
				title: "ハーブ乾燥",
				summary: "湿度の低い時間帯にハーブを乾燥させる。",
			},
			{
				id: "branch-cut",
				title: "流木カット",
				summary: "整備された刃で流木を切り出す。",
			},
			{
				id: "apple-press",
				title: "アップルプレス",
				summary: "果汁を抽出して濃縮素材を作る。",
			},
		],
	},
	{
		id: "star-dune",
		name: "星降る砂丘",
		subtitle: "夜になると砂粒が光を帯びる不思議なエリア",
		coverImage:
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
		description: "星砂を集めるには夜の風向きが重要になる。",
		activities: [
			{
				id: "stardust",
				title: "砂金と星砂の採取",
				summary: "光る砂を掘り起こして素材を集める。",
			},
			{
				id: "meteor",
				title: "流星の欠片探索",
				summary: "砂丘に落ちた欠片を探し出す。",
			},
			{
				id: "camp",
				title: "キャンプ設営",
				summary: "夜間の風を避ける拠点を構築する。",
			},
		],
	},
];

export const ExploreDetailPage = () => {
	const { destination, actions } = useExploreDetailPresenter({ destinations });

	return <ExploreDetailView destination={destination} actions={actions} />;
};
