import { Button } from "../../../components/button";
import { Card } from "../../../components/card";
import { PageLayout } from "../../layout";

export const View = () => {
	return (
		<PageLayout history={[]} currentLabel="その他">
			<Card>
				<div className="flex flex-col w-full h-80">
					<div className="flex flex-col items-center justify-center h-full gap-4">
						<div className="text-sm flex flex-col items-center gap-1">
							<div className="text-4xl">🍵</div>
							<div>¥300</div>
						</div>
						<Button>お茶を出す</Button>
						<div className="text-sm flex flex-col items-center gap-1">
							<div>サーバ代になります</div>
							<div>へんな石 500個プレゼント🎁</div>
						</div>
					</div>
				</div>
			</Card>
		</PageLayout>
	);
};
