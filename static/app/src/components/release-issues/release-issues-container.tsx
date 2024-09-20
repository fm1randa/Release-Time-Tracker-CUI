import { Box, xcss } from "@atlaskit/primitives";
import React from "react";
import type { PropsWithChildren } from "react";

export function ReleaseIssuesContainer({ children }: PropsWithChildren) {
	return (
		<Box
			xcss={xcss({
				borderColor: "color.border",
				borderWidth: "border.width",
				borderStyle: "solid",
				borderRadius: "border.radius",
				position: "relative",
				minHeight: "110px",
				display: "flex",
				flexDirection: "column",
			})}
			padding="space.100"
		>
			{children}
		</Box>
	);
}
