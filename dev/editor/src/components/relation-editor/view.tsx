type SelectOption = {
	value: number | string;
	label: string;
};

type FieldConfig = {
	name: string;
	label: string;
	type: "select" | "number";
	options?: SelectOption[];
};

type RelationEditorViewProps = {
	title: string;
	fields: FieldConfig[];
	values: Record<string, number | string>;
	onFieldChange: (name: string, value: number | string) => void;
	onSave: () => void;
	onCancel: () => void;
};

export function RelationEditorView({
	title,
	fields,
	values,
	onFieldChange,
	onSave,
	onCancel,
}: RelationEditorViewProps) {
	return (
		<div className="modal modal-open">
			<div className="modal-box">
				<h3 className="font-bold text-lg mb-4">{title}</h3>

				<div className="space-y-4">
					{fields.map((field) => (
						<div key={field.name} className="form-control">
							<label className="label">
								<span className="label-text">{field.label}</span>
							</label>
							{field.type === "select" && field.options ? (
								<select
									className="select select-bordered w-full"
									value={values[field.name] ?? ""}
									onChange={(e) =>
										onFieldChange(
											field.name,
											e.target.value === ""
												? ""
												: Number(e.target.value)
										)
									}
								>
									<option value="">選択してください</option>
									{field.options.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							) : (
								<input
									type="number"
									className="input input-bordered w-full"
									value={values[field.name] ?? ""}
									onChange={(e) =>
										onFieldChange(field.name, Number(e.target.value))
									}
								/>
							)}
						</div>
					))}
				</div>

				<div className="modal-action">
					<button type="button" className="btn btn-ghost" onClick={onCancel}>
						キャンセル
					</button>
					<button type="button" className="btn btn-primary" onClick={onSave}>
						保存
					</button>
				</div>
			</div>
			<div className="modal-backdrop" onClick={onCancel} onKeyDown={() => {}} />
		</div>
	);
}
