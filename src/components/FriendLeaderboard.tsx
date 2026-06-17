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
						className="rounded-xl border border-gray-200 p-3 sm:p-4"
					>
						<div className="flex items-baseline justify-between gap-2">
							<h3 className="font-semibold text-gray-900">
								{index + 1}. {standing.friend}
							</h3>
							<p className="shrink-0 text-sm text-gray-500">
								{standing.totalPoints} pts &middot; {standing.activeTeamCount}/
								{standing.teams.length} alive
							</p>
						</div>
						<ul className="mt-2 flex flex-wrap gap-1.5">
							{standing.teams.map((team) => (
								<TeamChip key={team.id} team={team} />
							))}
						</ul>
					</li>
				))}
			</ol>
		</section>
	);
}
