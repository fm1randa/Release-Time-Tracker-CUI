import { useQuery } from "@tanstack/react-query";
import { useReleaseStore } from "../../store/release-store";
import { requestJira } from "@forge/bridge";
import queryString from "query-string";
import type { IssueResponse } from "@typings/issue";
import { ErrorSectionMessage } from "../error-section-message";
import React from "react";
import { ReleaseIssuesContainer } from "./release-issues-container";
import { ReleaseIssuesBody } from "./release-issues-body";

async function getReleaseIssues({ releaseName }: { releaseName: string }) {
	const jql = `fixVersion = "${releaseName}"`;
	const params = queryString.stringify({ jql });

	const issuesResponse = await requestJira(
		`/rest/api/3/search?fields=summary,worklog&${params}`,
	).then(async (response) => (await response.json()) as IssueResponse);

	return issuesResponse.issues.map((issue) => ({
		id: issue.id,
		issueKey: issue.key,
		summary: issue.fields.summary,
		worklogs: issue.fields.worklog.worklogs,
	}));
}

export function ReleaseIssues() {
	const { selectedRelease } = useReleaseStore();

	const {
		data: issues,
		isLoading,
		isFetching,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["release-issues", selectedRelease?.id],
		queryFn: () =>
			getReleaseIssues({ releaseName: selectedRelease?.name || "" }),
		enabled: !!selectedRelease,
		retry: false,
	});

	if (isError) {
		return (
			<ErrorSectionMessage
				text="Could not fetch release issues."
				onRetry={refetch}
			/>
		);
	}

	return (
		<ReleaseIssuesContainer>
			<ReleaseIssuesBody
				isLoading={isLoading}
				isFetching={isFetching}
				issues={issues}
				refetchIssues={() => refetch()}
			/>
		</ReleaseIssuesContainer>
	);
}
