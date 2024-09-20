import Spinner from "@atlaskit/spinner";
import React from "react";

export function ReleaseIssuesFetchingSpinner({
	isFetching,
}: { isFetching: boolean }) {
	if (!isFetching) {
		return null;
	}
	return (
		<div style={{ position: "absolute", top: "10px", right: "10px" }}>
			<Spinner />
		</div>
	);
}
