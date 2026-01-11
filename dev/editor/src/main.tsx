import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { App } from "./App.tsx";
import { LayoutView } from "./pages/layout/index.tsx";
import { ItemsPage } from "./pages/items/index.tsx";
import { SkillsPage } from "./pages/skills/index.tsx";
import { ExploresPage } from "./pages/explores/index.tsx";
import { StagesPage } from "./pages/stages/index.tsx";
import "./style.css";

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");

createRoot(root).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<App />}>
					<Route element={<LayoutView />}>
						<Route path="/" element={<Navigate to="/items" replace />} />
						<Route path="items" element={<ItemsPage />} />
						<Route path="skills" element={<SkillsPage />} />
						<Route path="explores" element={<ExploresPage />} />
						<Route path="stages" element={<StagesPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
