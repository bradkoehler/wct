import { describe, expect, it } from "vitest";
import {
	getFriendStandings,
	getGroupTable,
	getTeamOwners,
} from "../src/lib/deriveStandings";
import type { TournamentData } from "../src/lib/types";

function makeTeam(overrides: Partial<TournamentData["teams"][string]> = {}) {
	return {
		id: "XXX",
		name: "Team X",
		group: "A",
		status: "active" as const,
		stats: {
			played: 3,
			won: 1,
			drawn: 1,
			lost: 1,
			goalsFor: 4,
			goalsAgainst: 3,
			points: 4,
			groupPosition: 2,
		},
		nextFixture: null,
		...overrides,
	};
}

const data: TournamentData = {
	lastUpdated: "2026-06-17T00:00:00Z",
	groups: {
		A: ["BRA", "CRO"],
	},
	knockoutMatches: [],
	teams: {
		BRA: makeTeam({
			id: "BRA",
			name: "Brazil",
			status: "active",
			stats: {
				played: 3,
				won: 3,
				drawn: 0,
				lost: 0,
				goalsFor: 7,
				goalsAgainst: 1,
				points: 9,
				groupPosition: 1,
			},
		}),
		CRO: makeTeam({
			id: "CRO",
			name: "Croatia",
			status: "knocked_out",
			stats: {
				played: 3,
				won: 0,
				drawn: 1,
				lost: 2,
				goalsFor: 2,
				goalsAgainst: 6,
				points: 1,
				groupPosition: 4,
			},
		}),
	},
};

describe("getFriendStandings", () => {
	it("sums points and goal difference across a friend's teams", () => {
		const [standing] = getFriendStandings(data, [
			{ friend: "Alice", teamIds: ["BRA", "CRO"] },
		]);

		expect(standing.totalPoints).toBe(10);
		expect(standing.totalGoalDifference).toBe(2);
		expect(standing.activeTeamCount).toBe(1);
	});

	it("ranks friends by total points, then goal difference", () => {
		const standings = getFriendStandings(data, [
			{ friend: "Bob", teamIds: ["CRO"] },
			{ friend: "Alice", teamIds: ["BRA"] },
		]);

		expect(standings.map((s) => s.friend)).toEqual(["Alice", "Bob"]);
	});

	it("ignores team ids that are not present in the tournament data", () => {
		const [standing] = getFriendStandings(data, [
			{ friend: "Charlie", teamIds: ["BRA", "UNKNOWN"] },
		]);

		expect(standing.teams).toHaveLength(1);
		expect(standing.totalPoints).toBe(9);
	});
});

describe("getGroupTable", () => {
	it("returns teams sorted by group position", () => {
		const table = getGroupTable(data, "A");
		expect(table.map((t) => t.id)).toEqual(["BRA", "CRO"]);
	});

	it("returns an empty array for an unknown group", () => {
		expect(getGroupTable(data, "Z")).toEqual([]);
	});
});

describe("getTeamOwners", () => {
	it("maps each team id to the friend who owns it", () => {
		const owners = getTeamOwners([
			{ friend: "Alice", teamIds: ["BRA", "CRO"] },
			{ friend: "Bob", teamIds: ["ARG"] },
		]);

		expect(owners).toEqual({ BRA: "Alice", CRO: "Alice", ARG: "Bob" });
	});

	it("returns an empty object when there are no friends", () => {
		expect(getTeamOwners([])).toEqual({});
	});
});
