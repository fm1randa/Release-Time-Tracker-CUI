import type { Issue } from "@typings/issue";
import { useReleaseStore } from "../../store/release-store";
import React, { Fragment } from "react";
import Spinner from "@atlaskit/spinner";
import { formatSeconds } from "@lib/format-seconds";
import { ReleaseIssuesFetchingSpinner } from "./release-issues-fetching-spinner";
import { ReleaseIssuesHeading } from "./release-issues-heading";
import { ReleaseIssuesSubHeading } from "./release-issues-sub-heading";
import { ReleaseIssuesList } from "./release-issues-list";
import { WorklogsModal } from "../worklogs-modal";

function getTotalWorkedSeconds(issues: Issue[]): number {
	return issues.reduce((acc, issue) => {
		return (
			acc +
			issue.worklogs.reduce((acc, worklog) => {
				return acc + worklog.timeSpentSeconds;
			}, 0)
		);
	}, 0);
}

export function ReleaseIssuesBody({
	isLoading,
	isFetching,
	issues,
	refetchIssues: refetch,
}: {
	isLoading: boolean;
	isFetching: boolean;
	issues: Issue[] | undefined;
	refetchIssues: () => void;
}) {
	const { selectedRelease } = useReleaseStore();

	const areIssuesLoading = (
		isLoading: boolean,
		issues: Issue[] | undefined,
	): issues is undefined => {
		return isLoading && !issues;
	};

	if (!selectedRelease || areIssuesLoading(isLoading, issues)) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					flex: "1",
				}}
			>
				<Spinner size={"medium"} />
			</div>
		);
	}

	const formattedTotalWorkedSeconds = formatSeconds(
		getTotalWorkedSeconds(issues),
	);

	const { name, startDate, releaseDate } = selectedRelease;
	return (
		<Fragment>
			<ReleaseIssuesFetchingSpinner isFetching={isFetching} />
			<ReleaseIssuesHeading
				totalWorkedSeconds={formattedTotalWorkedSeconds}
				releaseName={name}
			/>
			<ReleaseIssuesSubHeading
				releaseDate={releaseDate}
				startDate={startDate}
			/>
			<ReleaseIssuesList
				issues={issues}
				refetchIssues={refetch}
				isFetching={isFetching}
			/>
			<WorklogsModal />
		</Fragment>
	);
}
