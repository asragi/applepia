export type ItemMaster = {
	id: number;
	item_id: number;
	DisplayName: string;
	Description: string;
	Price: number;
	MaxStock: number;
	Attraction: number;
	PurchaseProb: number;
};

export type SkillMaster = {
	id: number;
	SkillId: number;
	DisplayName: string;
};

export type ExploreMaster = {
	id: number;
	ExploreId: number | string;
	DisplayName: string;
	Description: string;
	ConsumingStamina: number;
	RequiredPayment: number;
	StaminaReducibleRate: number;
};

export type StageMaster = {
	id: number;
	stage_id: number;
	display_name: string;
	description: string;
};

export type MasterType = "items" | "skills" | "explores" | "stages";
