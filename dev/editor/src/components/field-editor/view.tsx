type Field = {
	key: string;
	label: string;
	type: "text" | "number";
	editable?: boolean;
};

type FieldEditorViewProps = {
	fields: Field[];
	values: Record<string, string | number>;
	onUpdate: (key: string, value: string | number) => void;
};

export function FieldEditorView({ fields, values, onUpdate }: FieldEditorViewProps) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{fields.map((field) => (
				<label key={field.key} className="form-control">
					<div className="label">
						<span className="label-text text-sm text-base-content/70">
							{field.label}
						</span>
					</div>
					<input
						type={field.type}
						className="input input-bordered"
						value={values[field.key] ?? ""}
						disabled={field.editable === false}
						onChange={(e) => {
							const rawValue = e.target.value;
							const value =
								field.type === "number" ? Number(rawValue) : rawValue;
							onUpdate(field.key, rawValue === "" ? "" : value);
						}}
					/>
				</label>
			))}
		</div>
	);
}
