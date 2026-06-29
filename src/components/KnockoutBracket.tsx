import { getFlagUrl } from "../lib/flags";
import type { KnockoutMatch, Team } from "../lib/types";

const STAGE_ORDER: KnockoutMatch["stage"][] = [
	"LAST_32",
	"LAST_16",
	"QUARTER_FINALS",
	"SEMI_FINALS",
	"THIRD_PLACE",
	"FINAL",
];

const STAGE_LABELS: Record<KnockoutMatch["stage"], string> = {
	LAST_32: "Round of 32",
	LAST_16: "Round of 16",
	QUARTER_FINALS: "Quarter Finals",
	SEMI_FINALS: "Semi Finals",
	THIRD_PLACE: "Third Place",
	FINAL: "Final",
};

function TeamRow({
	teamId,
	teamName,
	owner,
	won,
	lost,
}: {
	teamId: string | null;
	teamName: string | null;
	owner: string | undefined;
	won: boolean;
	lost: boolean;
}) {
	if (!teamId) {
		return (
			<div className="flex items-center gap-2 py-1 text-sm italic text-gray-400">
				TBD
			</div>
		);
	}

	const flagUrl = getFlagUrl(teamId);
	return (
		<div
			className={`flex items-center gap-2 py-1 text-sm ${
				won
					? "font-bold text-gray-900"
					: lost
						? "text-gray-400 line-through"
						: "text-gray-700"
			}`}
		>
			{flagUrl && (
				<img
					src={flagUrl}
					alt=""
					aria-hidden="true"
					className="h-3 w-4 rounded-sm object-cover"
				/>
			)}
			<span className="flex-1">{teamName ?? teamId}</span>
			{owner && (
				<span className={`text-xs ${lost ? "text-gray-400" : "text-gray-500"}`}>
					{owner}
				</span>
			)}
		</div>
	);
}

function FeaturedTeam({
	teamId,
	teamName,
	owner,
}: {
	teamId: string | null;
	teamName: string | null;
	owner: string | undefined;
}) {
	const flagUrl = teamId ? getFlagUrl(teamId, 80) : null;
	return (
		<div className="flex flex-1 flex-col items-center gap-1 text-center">
			{flagUrl ? (
				<img
					src={flagUrl}
					alt=""
					aria-hidden="true"
					className="h-8 w-12 rounded object-cover"
				/>
			) : (
				<div className="h-8 w-12 rounded bg-gray-100" />
			)}
			<span className="text-sm font-semibold text-gray-900">
				{teamName ?? teamId ?? "TBD"}
			</span>
			{owner && (
				<span className="text-xs font-medium text-blue-600">{owner}</span>
			)}
		</div>
	);
}

function MatchCard({
	match,
	owners,
}: {
	match: KnockoutMatch;
	owners: Record<string, string>;
}) {
	const homeOwner = match.homeTeamId ? owners[match.homeTeamId] : undefined;
	const awayOwner = match.awayTeamId ? owners[match.awayTeamId] : undefined;
	const isFriendVsFriend = homeOwner && awayOwner && homeOwner === awayOwner;
	const isFinished = match.status === "FINISHED";
	const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";

	const homeWon = match.winner === "HOME_TEAM";
	const awayWon = match.winner === "AWAY_TEAM";

	return (
		<div
			className={`rounded-xl border border-gray-200 bg-white p-3 ${
				isFriendVsFriend ? "border-l-4 border-l-blue-400" : ""
			}`}
		>
			{isFinished ? (
				<>
					<TeamRow
						teamId={match.homeTeamId}
						teamName={match.homeTeamName}
						owner={homeOwner}
						won={homeWon}
						lost={!homeWon && match.winner !== null}
					/>
					<div className="my-1 border-t border-gray-100" />
					<TeamRow
						teamId={match.awayTeamId}
						teamName={match.awayTeamName}
						owner={awayOwner}
						won={awayWon}
						lost={!awayWon && match.winner !== null}
					/>
				</>
			) : (
				<>
					<div className="flex items-center gap-3">
						<FeaturedTeam
							teamId={match.homeTeamId}
							teamName={match.homeTeamName}
							owner={homeOwner}
						/>
						<span className="text-base font-bold text-gray-300">vs</span>
						<FeaturedTeam
							teamId={match.awayTeamId}
							teamName={match.awayTeamName}
							owner={awayOwner}
						/>
					</div>
					<p className="mt-2 text-center text-xs text-gray-400">
						{isLive ? (
							<span className="font-semibold text-red-500">LIVE</span>
						) : (
							new Date(match.utcDate).toLocaleString()
						)}
					</p>
				</>
			)}
		</div>
	);
}

export function KnockoutBracket({
	matches,
	owners,
}: {
	matches: KnockoutMatch[];
	owners: Record<string, string>;
	teams: Record<string, Team>;
}) {
	if (matches.length === 0) {
		return (
			<section aria-labelledby="bracket-heading" className="space-y-4">
				<h2
					id="bracket-heading"
					className="text-xl font-semibold text-gray-900"
				>
					Knockout Bracket
				</h2>
				<p className="text-gray-500">
					Bracket data will appear once knockout rounds begin.
				</p>
			</section>
		);
	}

	const matchesByStage = STAGE_ORDER.reduce<
		Partial<Record<KnockoutMatch["stage"], KnockoutMatch[]>>
	>((acc, stage) => {
		acc[stage] = matches.filter((m) => m.stage === stage);
		return acc;
	}, {});

	return (
		<section aria-labelledby="bracket-heading" className="space-y-6">
			<h2 id="bracket-heading" className="text-xl font-semibold text-gray-900">
				Knockout Bracket
			</h2>
			{STAGE_ORDER.map((stage) => {
				const stageMatches = matchesByStage[stage];
				if (!stageMatches || stageMatches.length === 0) return null;
				return (
					<div key={stage} className="space-y-2">
						<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
							{STAGE_LABELS[stage]}
						</h3>
						<div className="space-y-2">
							{stageMatches.map((match) => (
								<MatchCard
									key={`${stage}-${match.homeTeamId ?? "tbd"}-${match.awayTeamId ?? "tbd"}`}
									match={match}
									owners={owners}
								/>
							))}
						</div>
					</div>
				);
			})}
		</section>
	);
}
