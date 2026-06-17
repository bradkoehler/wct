export interface TabOption<T extends string> {
	value: T;
	label: string;
}

export function Tabs<T extends string>({
	options,
	value,
	onChange,
}: {
	options: TabOption<T>[];
	value: T;
	onChange: (value: T) => void;
}) {
	return (
		<div role="tablist" className="flex gap-1 rounded-lg bg-gray-100 p-1">
			{options.map((option) => {
				const selected = option.value === value;
				return (
					<button
						key={option.value}
						type="button"
						role="tab"
						aria-selected={selected}
						onClick={() => onChange(option.value)}
						className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							selected
								? "bg-white text-gray-900 shadow"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
