import Heading from "@atlaskit/heading";
import { Box, Inline, xcss } from "@atlaskit/primitives";
import React from "react";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Badge from "@atlaskit/badge";

export function ReleaseIssuesHeading({
	releaseName,
	totalWorkedSeconds,
}: { releaseName: string; totalWorkedSeconds: string }) {
	return (
		<Heading size="medium">
			<Inline>
				{releaseName}
				<ChevronRightIcon label="Divider" size="medium" />
				Worked issues
				<Box
					xcss={xcss({
						height: "100%",
						paddingLeft: "space.150",
					})}
				>
					<Badge appearance="primary">{totalWorkedSeconds}</Badge>
				</Box>
			</Inline>
		</Heading>
	);
}
