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
			<table className="w-full text-sm">
				<caption className="px-3 py-2 text-left font-semibold text-gray-900">
					Group {group}
				</caption>
				<thead>
					<tr className="bg-gray-50 text-left text-gray-500">
						<th scope="col" className="px-2 py-2 sm:px-3">
							Team
						</th>
						<th scope="col" className="px-2 py-2 sm:px-3">
							Friend
						</th>
						<th
							scope="col"
							className="hidden px-3 py-2 text-right sm:table-cell"
						>
							P
						</th>
						<th
							scope="col"
							className="hidden px-3 py-2 text-right sm:table-cell"
						>
							W
						</th>
						<th
							scope="col"
							className="hidden px-3 py-2 text-right sm:table-cell"
						>
							D
						</th>
						<th
							scope="col"
							className="hidden px-3 py-2 text-right sm:table-cell"
						>
							L
						</th>
						<th scope="col" className="px-2 py-2 text-right sm:px-3">
							GD
						</th>
						<th scope="col" className="px-2 py-2 text-right sm:px-3">
							Pts
						</th>
					</tr>
				</thead>
				<tbody>
					{teams.map((team) => (
						<tr key={team.id} className="border-t border-gray-100">
							<th
								scope="row"
								className="px-2 py-2 text-left font-medium text-gray-900 sm:px-3"
							>
								{team.name}
							</th>
							<td className="px-2 py-2 text-gray-500 sm:px-3">
								{owners[team.id] ?? "—"}
							</td>
							<td className="hidden px-3 py-2 text-right sm:table-cell">
								{team.stats.played}
							</td>
							<td className="hidden px-3 py-2 text-right sm:table-cell">
								{team.stats.won}
							</td>
							<td className="hidden px-3 py-2 text-right sm:table-cell">
								{team.stats.drawn}
							</td>
							<td className="hidden px-3 py-2 text-right sm:table-cell">
								{team.stats.lost}
							</td>
							<td className="px-2 py-2 text-right sm:px-3">
								{team.stats.goalsFor - team.stats.goalsAgainst}
							</td>
							<td className="px-2 py-2 text-right font-semibold sm:px-3">
								{team.stats.points}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
