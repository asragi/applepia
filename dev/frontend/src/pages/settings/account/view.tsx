interface AccountSettingsViewProps {
	linked: boolean;
	error: string | null;
	onLinkGoogle: () => void;
}

export const AccountSettingsView = ({
	linked,
	error,
	onLinkGoogle,
}: AccountSettingsViewProps) => {
	return (
		<div className="min-h-screen bg-base-200 px-4 py-8">
			<div className="mx-auto w-full max-w-2xl space-y-6">
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body gap-4">
						<h1 className="card-title text-2xl">アカウント連携</h1>
						{error && <div className="alert alert-error">{error}</div>}
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-base-content/70">Google連携</p>
								<p className="text-lg font-semibold">
									{linked ? "連携済み" : "未連携"}
								</p>
							</div>
							<button
								className="btn btn-primary"
								onClick={onLinkGoogle}
								disabled={linked}
								type="button"
							>
								{linked ? "連携済み" : "Googleアカウント連携"}
							</button>
						</div>
						<p className="text-sm text-base-content/60">
							連携すると別端末からGoogleログインで移行できます。
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
