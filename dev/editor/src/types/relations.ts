export type EarningItem = {
	id: number;
	ExploreId: number;
	ItemId: number;
	MinCount: number;
	MaxCount: number;
	probability: number;
};

export type ConsumingItem = {
	id: number;
	ExploreId: number | string;
	ItemId: number;
	MaxCount: number;
	ConsumptionProb: number;
};

export type RequiredSkill = {
	id: number;
	ExploreId: number;
	RequiredSkillId: number;
	SkillLv: number;
};

export type SkillGrowth = {
	id: number;
	explore_id: number;
	skill_id: number;
	gaining_point: number;
};

export type StageExploreRelation = {
	id: number;
	stage_id: number;
	explore_id: number;
};

export type ReductionStamina = {
	id: number;
	ExploreId: number;
	SkillId: number;
};

export type ItemExploreRelation = {
	id: number;
	item_id: number;
	explore_id: number;
};

export type RelationType =
	| "earning-items"
	| "consuming-items"
	| "required-skills"
	| "skill-growth"
	| "stage-explores"
	| "reduction-stamina"
	| "item-explores";
