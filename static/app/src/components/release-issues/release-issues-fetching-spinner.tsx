import Spinner from "@atlaskit/spinner";
import React from "react";

export function ReleaseIssuesFetchingSpinner({
	isFetching,
}: { isFetching: boolean }) {
	if (!isFetching) {
		return null;
	}
	return <Spinner />;
}
