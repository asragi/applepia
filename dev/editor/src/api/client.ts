import type { MasterType } from "../types/masters.ts";
import type { RelationType } from "../types/relations.ts";

const API_BASE = "/api";

export async function fetchMaster<T>(type: MasterType): Promise<T[]> {
	const response = await fetch(`${API_BASE}/masters/${type}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
	}
	return response.json();
}

export async function saveMaster<T>(type: MasterType, data: T[]): Promise<void> {
	const response = await fetch(`${API_BASE}/masters/${type}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error(`Failed to save ${type}: ${response.statusText}`);
	}
}

export async function fetchRelation<T>(type: RelationType): Promise<T[]> {
	const response = await fetch(`${API_BASE}/relations/${type}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
	}
	return response.json();
}

export async function saveRelation<T>(type: RelationType, data: T[]): Promise<void> {
	const response = await fetch(`${API_BASE}/relations/${type}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error(`Failed to save ${type}: ${response.statusText}`);
	}
}
