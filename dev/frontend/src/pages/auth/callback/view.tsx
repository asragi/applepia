interface AuthCallbackViewProps {
	status: "loading" | "success" | "error";
	message: string;
}

export const AuthCallbackView = ({
	status,
	message,
}: AuthCallbackViewProps) => {
	return (
		<div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body gap-4">
					<h1 className="card-title text-2xl">Google認証</h1>
					<div
						className={
							status === "error" ? "alert alert-error" : "alert alert-info"
						}
					>
						{message}
					</div>
					{status === "loading" && (
						<div className="flex items-center gap-2 text-sm">
							<span className="loading loading-spinner" />
							<span>処理中...</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
