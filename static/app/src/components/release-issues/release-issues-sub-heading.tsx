import { Box, xcss } from "@atlaskit/primitives";
import React from "react";

export function ReleaseIssuesSubHeading({
	startDate,
	releaseDate,
}: { startDate: string; releaseDate: string }) {
	return (
		<Box
			xcss={xcss({
				color: "color.text.subtlest",
				paddingBottom: "space.200",
			})}
		>
			{startDate} - {releaseDate}
		</Box>
	);
}
