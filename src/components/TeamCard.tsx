import type { Team } from "../lib/types";

const statusStyles: Record<Team["status"], string> = {
	active: "bg-green-100 text-green-800",
	knocked_out: "bg-gray-100 text-gray-500",
	champion: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<Team["status"], string> = {
	active: "Active",
	knocked_out: "Knocked out",
	champion: "Champion",
};

export function TeamCard({ team }: { team: Team }) {
	return (
		<li className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
			<div>
				<p className="font-medium text-gray-900">{team.name}</p>
				<p className="text-sm text-gray-500">
					Group {team.group} &middot; Pos {team.stats.groupPosition} &middot;{" "}
					{team.stats.points} pts
				</p>
				{team.nextFixture && (
					<p className="text-sm text-gray-500">
						Next: vs {team.nextFixture.opponentName} (
						{new Date(team.nextFixture.utcDate).toLocaleDateString()})
					</p>
				)}
			</div>
			<span
				className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[team.status]}`}
			>
				{statusLabels[team.status]}
			</span>
		</li>
	);
}
