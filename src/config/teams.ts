import type { FriendAssignment } from "../lib/types";

/**
 * Team codes are FIFA 3-letter codes. A few of the less common associations
 * (e.g. Cape Verde, Curacao) may use a slightly different code in the
 * football-data.org API response — cross-check against public/data.json
 * after the first real fetch and adjust here if any team doesn't match up.
 */
export const friends: FriendAssignment[] = [
	{ friend: "Mark", teamIds: ["CPV", "ARG", "ALG", "IRQ", "SCO", "AUT"] },
	{ friend: "Dyer", teamIds: ["SUI", "NZL", "SEN", "JOR", "CAN", "PAN"] },
	{ friend: "Brad", teamIds: ["TUN", "MAR", "ENG", "CZE", "CRO", "TUR"] },
	{ friend: "Callum", teamIds: ["KSA", "EGY", "BIH", "RSA", "FRA", "SWE"] },
	{ friend: "Danny", teamIds: ["ECU", "ESP", "GER", "USA", "GHA", "AUS"] },
	{ friend: "Matt", teamIds: ["CIV", "URU", "POR", "JPN", "QAT", "NED"] },
	{ friend: "Simon", teamIds: ["PAR", "MEX", "NOR", "COD", "KOR", "IRN"] },
	{ friend: "Tim", teamIds: ["CUW", "HAI", "BEL", "BRA", "UZB", "COL"] },
];
