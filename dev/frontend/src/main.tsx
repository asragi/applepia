import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import { App } from "./App.tsx";
import { Layout } from "./components/layout/view.tsx";
import { AuthProvider } from "./features/auth/hooks/AuthProvider";
import { AuthCallbackPage } from "./pages/auth/callback";
import { DashboardPage } from "./pages/dashboard/index.tsx";
import { DataPage } from "./pages/data/index.tsx";
import { ExploreActionPage } from "./pages/explore/action/index.tsx";
import { ExploreDetailPage } from "./pages/explore/detail/index.tsx";
import { ExplorePage } from "./pages/explore/top/index.tsx";
import { ItemDetailPage } from "./pages/inventory/detail/index.tsx";
import { ItemDisplayPage } from "./pages/inventory/display/index.tsx";
import { ItemExplorePage } from "./pages/inventory/explore/index.tsx";
import { ItemExploreResultPage } from "./pages/inventory/result/index.tsx";
import { InventoryPage } from "./pages/inventory/top";
import { LoginPage } from "./pages/login";
import { PurchasePage } from "./pages/purchase/top/index.tsx";
import { AccountSettingsPage } from "./pages/settings/account";
import { TopPage } from "./pages/top";

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");

createRoot(root).render(
	<StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<App />}>
						<Route path="/" element={<TopPage />} />
						<Route path="login" element={<LoginPage />} />
						<Route path="auth/callback" element={<AuthCallbackPage />} />
						<Route element={<Layout />}>
							<Route path="dashboard" element={<DashboardPage />} />
							<Route path="inventory" element={<InventoryPage />} />
							<Route path="inventory/detail/:id" element={<ItemDetailPage />} />
							<Route
								path="inventory/display/:id"
								element={<ItemDisplayPage />}
							/>
							<Route
								path="inventory/explore/:id"
								element={<ItemExplorePage />}
							/>
							<Route
								path="inventory/explore/result"
								element={<ItemExploreResultPage />}
							/>
							<Route path="explore" element={<ExplorePage />} />
							<Route
								path="explore/:destinationId"
								element={<ExploreDetailPage />}
							/>
							<Route
								path="explore/:destinationId/action/:actionId"
								element={<ExploreActionPage />}
							/>
							<Route path="shops" element={<div>Shops Page</div>} />
							<Route
								path="data"
								element={
									<NavLink to="/data/skills" className="btn">
										tmp Data Home
									</NavLink>
								}
							/>
							<Route path="data/skills" element={<DataPage />} />
							<Route path="purchase" element={<PurchasePage />} />
							<Route
								path="settings/account"
								element={<AccountSettingsPage />}
							/>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	</StrictMode>,
);
