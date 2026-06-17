import type { FriendStanding } from "../lib/types";
import { TeamChip } from "./TeamChip";

export function FriendLeaderboard({
	standings,
}: {
	standings: FriendStanding[];
}) {
	return (
		<section aria-labelledby="leaderboard-heading" className="space-y-3">
			<h2
				id="leaderboard-heading"
				className="text-xl font-semibold text-gray-900"
			>
				Leaderboard
			</h2>
			<ol className="space-y-3">
				{standings.map((standing, index) => (
					<li
						key={standing.friend}
						className="flex gap-3 rounded-xl border border-gray-200 p-3 sm:p-4"
					>
						<div className="min-w-0 flex-1">
							<h3 className="font-semibold text-gray-900">
								{index + 1}. {standing.friend}
							</h3>
							<ul className="mt-2 flex flex-wrap gap-1.5">
								{standing.teams.map((team) => (
									<TeamChip key={team.id} team={team} />
								))}
							</ul>
						</div>
						<div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-50 text-center sm:w-24">
							<p className="text-3xl font-bold leading-none text-gray-900">
								{standing.totalPoints}
							</p>
							<p className="text-[11px] uppercase tracking-wide text-gray-400">
								pts
							</p>
							<p className="mt-1 text-xs font-medium text-gray-600">
								{standing.activeTeamCount}/{standing.teams.length} alive
							</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
