import { useEffect, useState } from "react";
import { FriendLeaderboard } from "./components/FriendLeaderboard";
import { GroupTable } from "./components/GroupTable";
import { Tabs } from "./components/Tabs";
import { friends } from "./config/teams";
import {
	getFriendStandings,
	getGroupTable,
	getTeamOwners,
} from "./lib/deriveStandings";
import type { TournamentData } from "./lib/types";

type View = "leaderboard" | "groups";

function App() {
	const [data, setData] = useState<TournamentData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [view, setView] = useState<View>("leaderboard");

	useEffect(() => {
		fetch(`${import.meta.env.BASE_URL}data.json`)
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
				return res.json() as Promise<TournamentData>;
			})
			.then(setData)
			.catch((err: Error) => setError(err.message));
	}, []);

	if (error) {
		return (
			<main className="mx-auto max-w-2xl p-4 sm:p-6">
				<p role="alert" className="text-red-600">
					{error}
				</p>
			</main>
		);
	}

	if (!data) {
		return (
			<main className="mx-auto max-w-2xl p-4 sm:p-6">
				<p aria-live="polite">Loading...</p>
			</main>
		);
	}

	const standings = getFriendStandings(data, friends);
	const owners = getTeamOwners(friends);
	const groups = Object.keys(data.groups).sort();

	return (
		<main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
			<header>
				<h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
					World Cup Tracker
				</h1>
				<p className="text-sm text-gray-500">
					Last updated {new Date(data.lastUpdated).toLocaleString()}
				</p>
			</header>

			{friends.length === 0 ? (
				<p className="text-gray-500">
					No friends configured yet &mdash; add assignments in{" "}
					<code className="rounded bg-gray-100 px-1 py-0.5">
						src/config/teams.ts
					</code>
					.
				</p>
			) : (
				<>
					<Tabs
						value={view}
						onChange={setView}
						options={[
							{ value: "leaderboard", label: "Leaderboard" },
							{ value: "groups", label: "Groups" },
						]}
					/>

					{view === "leaderboard" ? (
						<FriendLeaderboard standings={standings} />
					) : (
						<section aria-labelledby="groups-heading" className="space-y-4">
							<h2 id="groups-heading" className="sr-only">
								Group Stage
							</h2>
							<div className="space-y-4">
								{groups.map((group) => (
									<GroupTable
										key={group}
										group={group}
										teams={getGroupTable(data, group)}
										owners={owners}
									/>
								))}
							</div>
						</section>
					)}
				</>
			)}
		</main>
	);
}

export default App;
