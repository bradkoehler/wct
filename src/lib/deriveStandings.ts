import type {
	FriendAssignment,
	FriendStanding,
	Team,
	TournamentData,
} from "./types";

export function getFriendStandings(
	data: TournamentData,
	friends: FriendAssignment[],
): FriendStanding[] {
	const standings = friends.map((assignment) =>
		buildFriendStanding(data, assignment),
	);
	return standings.sort(
		(a, b) =>
			b.totalPoints - a.totalPoints ||
			b.totalGoalDifference - a.totalGoalDifference ||
			a.friend.localeCompare(b.friend),
	);
}

function buildFriendStanding(
	data: TournamentData,
	assignment: FriendAssignment,
): FriendStanding {
	const teams = assignment.teamIds
		.map((id) => data.teams[id])
		.filter((team): team is Team => team !== undefined);

	const totalPoints = teams.reduce((sum, team) => sum + team.stats.points, 0);
	const totalGoalDifference = teams.reduce(
		(sum, team) => sum + (team.stats.goalsFor - team.stats.goalsAgainst),
		0,
	);
	const activeTeamCount = teams.filter(
		(team) => team.status !== "knocked_out",
	).length;

	return {
		friend: assignment.friend,
		teams,
		totalPoints,
		totalGoalDifference,
		activeTeamCount,
	};
}

export function getGroupTable(data: TournamentData, group: string): Team[] {
	const teamIds = data.groups[group] ?? [];
	return teamIds
		.map((id) => data.teams[id])
		.filter((team): team is Team => team !== undefined)
		.sort((a, b) => a.stats.groupPosition - b.stats.groupPosition);
}

export function getTeamOwners(
	friends: FriendAssignment[],
): Record<string, string> {
	const owners: Record<string, string> = {};
	for (const assignment of friends) {
		for (const teamId of assignment.teamIds) {
			owners[teamId] = assignment.friend;
		}
	}
	return owners;
}
