import type { FriendStanding } from "../lib/types";
import { TeamCard } from "./TeamCard";

export function FriendLeaderboard({
	standings,
}: {
	standings: FriendStanding[];
}) {
	return (
		<section aria-labelledby="leaderboard-heading" className="space-y-4">
			<h2
				id="leaderboard-heading"
				className="text-xl font-semibold text-gray-900"
			>
				Leaderboard
			</h2>
			<ol className="space-y-4">
				{standings.map((standing, index) => (
					<li
						key={standing.friend}
						className="rounded-xl border border-gray-200 p-4"
					>
						<div className="flex items-baseline justify-between">
							<h3 className="text-lg font-semibold text-gray-900">
								{index + 1}. {standing.friend}
							</h3>
							<p className="text-sm text-gray-500">
								{standing.totalPoints} pts &middot; {standing.activeTeamCount}{" "}
								active
							</p>
						</div>
						<ul className="mt-3 space-y-2">
							{standing.teams.map((team) => (
								<TeamCard key={team.id} team={team} />
							))}
						</ul>
					</li>
				))}
			</ol>
		</section>
	);
}
