import type { PropsWithChildren } from "react";
import React from "react";

export function ReleaseIssuesTopRightActions({ children }: PropsWithChildren) {
	return (
		<div
			style={{
				position: "absolute",
				top: "10px",
				right: "10px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "1em",
			}}
		>
			{children}
		</div>
	);
}
