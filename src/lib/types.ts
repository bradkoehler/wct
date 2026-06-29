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

export interface KnockoutMatch {
	stage:
		| "LAST_32"
		| "LAST_16"
		| "QUARTER_FINALS"
		| "SEMI_FINALS"
		| "THIRD_PLACE"
		| "FINAL";
	utcDate: string;
	status: string;
	homeTeamId: string | null;
	homeTeamName: string | null;
	awayTeamId: string | null;
	awayTeamName: string | null;
	winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
}

export interface TournamentData {
	lastUpdated: string;
	teams: Record<string, Team>;
	groups: Record<string, string[]>;
	knockoutMatches: KnockoutMatch[];
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
