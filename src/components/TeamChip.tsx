import type { Team } from "../lib/types";

const chipStyles: Record<Team["status"], string> = {
	active: "border-green-200 bg-green-50 text-green-800",
	knocked_out: "border-gray-200 bg-gray-50 text-gray-400 line-through",
	champion: "border-yellow-300 bg-yellow-50 text-yellow-800",
};

const dotStyles: Record<Team["status"], string> = {
	active: "bg-green-500",
	knocked_out: "bg-gray-400",
	champion: "bg-yellow-500",
};

const statusLabels: Record<Team["status"], string> = {
	active: "active",
	knocked_out: "knocked out",
	champion: "champion",
};

function describeTeam(team: Team): string {
	const base = `${team.name}: ${team.stats.points} pts, ${statusLabels[team.status]}`;
	if (!team.nextFixture) return base;
	const date = new Date(team.nextFixture.utcDate).toLocaleDateString();
	return `${base}, next vs ${team.nextFixture.opponentName} (${date})`;
}

export function TeamChip({ team }: { team: Team }) {
	return (
		<li>
			<span
				className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${chipStyles[team.status]}`}
				title={describeTeam(team)}
			>
				<span
					aria-hidden="true"
					className={`h-1.5 w-1.5 rounded-full ${dotStyles[team.status]}`}
				/>
				<span className="sr-only">{describeTeam(team)}</span>
				<span aria-hidden="true">
					{team.id} &middot; {team.stats.points}
				</span>
			</span>
		</li>
	);
}
