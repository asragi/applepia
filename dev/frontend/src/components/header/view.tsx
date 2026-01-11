import { FundsDisplay } from "./funds";
import { GachaDisplay } from "./gacha";
import { PlayerIcon } from "./icon";
import { StoreName } from "./name";
import { StatBar } from "./stat";

const mockPlayer = {
	storeName: "きさらぎりんごレストラン",
	funds: 987654321000,
	gachaStones: 32,
	fullness: 68,
	stamina: 42,
	icon: "🏪",
};

export const Header = () => {
	return (
		<header className="fixed top-0 left-0 right-0 bg-base-100 shadow z-50">
			<div className="max-w-4xl mx-auto px-6 h-28 flex items-center gap-6">
				<PlayerIcon icon={mockPlayer.icon} />

				<div className="flex-1">
					<StoreName storeName={mockPlayer.storeName} />
					<div className="text-sm text-base-content/70 mt-1 flex justify-between">
						<FundsDisplay funds={mockPlayer.funds} />
						<GachaDisplay stones={mockPlayer.gachaStones} />
					</div>
					<div className="mt-1 flex gap-6">
						<div className="flex-1">
							<StatBar
								label="満腹度"
								value={mockPlayer.fullness}
								barClassName="bg-secondary"
							/>
						</div>
						<div className="flex-1">
							<StatBar
								label="スタミナ"
								value={mockPlayer.stamina}
								barClassName="bg-accent"
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
