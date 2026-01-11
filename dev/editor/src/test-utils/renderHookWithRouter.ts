import React from "react";
import { act, create } from "react-test-renderer";
import { RouterProvider, createMemoryRouter } from "react-router";

export async function flushPromises() {
	return act(async () => {
		await Promise.resolve();
		await Promise.resolve();
	});
}

export async function renderHookWithRouter<T>(
	useHook: () => T,
	options: { initialPath: string; routePath: string }
) {
	let hookValue: T | null = null;

	const TestComponent = () => {
		hookValue = useHook();
		return null;
	};

	const router = createMemoryRouter(
		[
			{
				path: options.routePath,
				element: React.createElement(TestComponent),
			},
		],
		{ initialEntries: [options.initialPath] }
	);

	await act(async () => {
		create(React.createElement(RouterProvider, { router }));
	});
	await flushPromises();

	const getResult = () => {
		if (!hookValue) {
			throw new Error("Presenter not initialized");
		}
		return hookValue;
	};

	return { getResult, router };
}
