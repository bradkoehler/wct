import type { Team } from "../lib/types";

export function GroupTable({
	group,
	teams,
	owners,
}: {
	group: string;
	teams: Team[];
	owners: Record<string, string>;
}) {
	return (
		<div className="overflow-x-auto rounded-xl border border-gray-200">
			<table className="w-full min-w-[480px] text-sm">
				<caption className="px-3 py-2 text-left font-semibold text-gray-900">
					Group {group}
				</caption>
				<thead>
					<tr className="bg-gray-50 text-left text-gray-500">
						<th scope="col" className="px-3 py-2">
							Team
						</th>
						<th scope="col" className="px-3 py-2">
							Friend
						</th>
						<th scope="col" className="px-3 py-2 text-right">
							P
						</th>
						<th scope="col" className="px-3 py-2 text-right">
							W
						</th>
						<th scope="col" className="px-3 py-2 text-right">
							D
						</th>
						<th scope="col" className="px-3 py-2 text-right">
							L
						</th>
						<th scope="col" className="px-3 py-2 text-right">
							GD
						</th>
						<th scope="col" className="px-3 py-2 text-right">
							Pts
						</th>
					</tr>
				</thead>
				<tbody>
					{teams.map((team) => (
						<tr key={team.id} className="border-t border-gray-100">
							<th
								scope="row"
								className="px-3 py-2 text-left font-medium text-gray-900"
							>
								{team.name}
							</th>
							<td className="px-3 py-2 text-gray-500">
								{owners[team.id] ?? "—"}
							</td>
							<td className="px-3 py-2 text-right">{team.stats.played}</td>
							<td className="px-3 py-2 text-right">{team.stats.won}</td>
							<td className="px-3 py-2 text-right">{team.stats.drawn}</td>
							<td className="px-3 py-2 text-right">{team.stats.lost}</td>
							<td className="px-3 py-2 text-right">
								{team.stats.goalsFor - team.stats.goalsAgainst}
							</td>
							<td className="px-3 py-2 text-right font-semibold">
								{team.stats.points}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
