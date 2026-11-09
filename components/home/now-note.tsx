import { StatusChip } from "@/components/ui/chips";

export function NowNote({
	label,
	now,
}: {
	readonly label: string;
	readonly now: string;
}): React.ReactElement {
	return (
		<div className="flex flex-[1_1_260px] flex-col gap-2 self-start rounded-md border border-dashed border-field-line bg-raised p-5">
			<StatusChip>{label}</StatusChip>
			<p className="text-body-sm">{now}</p>
		</div>
	);
}
