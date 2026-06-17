import { writeFileSync } from "node:fs";
import type {
	Fixture,
	Team,
	TeamStatus,
	TournamentData,
} from "../src/lib/types";

const COMPETITION_CODE = "WC";
const API_BASE = "https://api.football-data.org/v4";
const OUTPUT_PATH = new URL("../public/data.json", import.meta.url);

const KNOCKOUT_STAGES = new Set([
	"LAST_16",
	"QUARTER_FINALS",
	"SEMI_FINALS",
	"THIRD_PLACE",
	"FINAL",
]);

interface ApiTeam {
	id: number;
	name: string;
	tla: string;
}

interface ApiStandingTableRow {
	position: number;
	team: ApiTeam;
	playedGames: number;
	won: number;
	draw: number;
	lost: number;
	points: number;
	goalsFor: number;
	goalsAgainst: number;
}

interface ApiStanding {
	group: string;
	table: ApiStandingTableRow[];
}

interface ApiStandingsResponse {
	standings: ApiStanding[];
}

interface ApiMatch {
	utcDate: string;
	status: string;
	stage: string;
	homeTeam: ApiTeam;
	awayTeam: ApiTeam;
	score: {
		winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
	};
}

interface ApiMatchesResponse {
	matches: ApiMatch[];
}

async function fetchJson<T>(path: string, apiKey: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: { "X-Auth-Token": apiKey },
	});
	if (!res.ok) {
		throw new Error(
			`football-data.org request failed: ${path} -> ${res.status}`,
		);
	}
	return res.json() as Promise<T>;
}

function deriveTeamStatus(tla: string, matches: ApiMatch[]): TeamStatus {
	const knockoutMatches = matches.filter(
		(match) =>
			KNOCKOUT_STAGES.has(match.stage) &&
			match.status === "FINISHED" &&
			(match.homeTeam.tla === tla || match.awayTeam.tla === tla),
	);

	const final = knockoutMatches.find((match) => match.stage === "FINAL");
	if (final) {
		const isHome = final.homeTeam.tla === tla;
		const won = final.score.winner === (isHome ? "HOME_TEAM" : "AWAY_TEAM");
		if (won) return "champion";
	}

	const lostKnockoutMatch = knockoutMatches.find((match) => {
		const isHome = match.homeTeam.tla === tla;
		const lostOutcome = isHome ? "AWAY_TEAM" : "HOME_TEAM";
		return match.score.winner === lostOutcome;
	});

	if (lostKnockoutMatch) return "knocked_out";
	return "active";
}

function findNextFixture(tla: string, matches: ApiMatch[]): Fixture | null {
	const upcoming = matches
		.filter(
			(match) =>
				match.status !== "FINISHED" &&
				(match.homeTeam.tla === tla || match.awayTeam.tla === tla),
		)
		.sort(
			(a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
		);

	const next = upcoming[0];
	if (!next) return null;

	const isHome = next.homeTeam.tla === tla;
	const opponent = isHome ? next.awayTeam : next.homeTeam;
	return {
		opponentId: opponent.tla,
		opponentName: opponent.name,
		utcDate: next.utcDate,
		stage: next.stage,
	};
}

async function main() {
	const apiKey = process.env.FOOTBALL_DATA_API_KEY;
	if (!apiKey) {
		throw new Error("FOOTBALL_DATA_API_KEY environment variable is required");
	}

	const [standingsRes, matchesRes] = await Promise.all([
		fetchJson<ApiStandingsResponse>(
			`/competitions/${COMPETITION_CODE}/standings`,
			apiKey,
		),
		fetchJson<ApiMatchesResponse>(
			`/competitions/${COMPETITION_CODE}/matches`,
			apiKey,
		),
	]);

	const groups: TournamentData["groups"] = {};
	const teams: TournamentData["teams"] = {};

	for (const standing of standingsRes.standings) {
		const groupLetter = standing.group.replace("GROUP_", "");
		groups[groupLetter] = standing.table.map((row) => row.team.tla);

		for (const row of standing.table) {
			const tla = row.team.tla;
			const team: Team = {
				id: tla,
				name: row.team.name,
				group: groupLetter,
				status: deriveTeamStatus(tla, matchesRes.matches),
				stats: {
					played: row.playedGames,
					won: row.won,
					drawn: row.draw,
					lost: row.lost,
					goalsFor: row.goalsFor,
					goalsAgainst: row.goalsAgainst,
					points: row.points,
					groupPosition: row.position,
				},
				nextFixture: findNextFixture(tla, matchesRes.matches),
			};
			teams[tla] = team;
		}
	}

	const data: TournamentData = {
		lastUpdated: new Date().toISOString(),
		groups,
		teams,
	};

	writeFileSync(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`);
	console.log(
		`Wrote ${Object.keys(teams).length} teams across ${Object.keys(groups).length} groups to ${OUTPUT_PATH}`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
