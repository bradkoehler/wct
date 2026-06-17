export type TeamStatus = "active" | "knocked_out" | "champion";

export interface TeamStats {
	played: number;
	won: number;
	drawn: number;
	lost: number;
	goalsFor: number;
	goalsAgainst: number;
	points: number;
	groupPosition: number;
}

export interface Fixture {
	opponentId: string;
	opponentName: string;
	utcDate: string;
	stage: string;
}

export interface Team {
	id: string;
	name: string;
	group: string;
	status: TeamStatus;
	stats: TeamStats;
	nextFixture: Fixture | null;
}

export interface TournamentData {
	lastUpdated: string;
	teams: Record<string, Team>;
	groups: Record<string, string[]>;
}

export interface FriendAssignment {
	friend: string;
	teamIds: string[];
}

export interface FriendStanding {
	friend: string;
	teams: Team[];
	totalPoints: number;
	totalGoalDifference: number;
	activeTeamCount: number;
}
