import { useQuery } from "@tanstack/react-query";
import { useReleaseStore } from "../../store/release-store";
import { requestJira } from "@forge/bridge";
import queryString from "query-string";
import type { IssueResponse } from "@typings/issue";
import { ErrorSectionMessage } from "../error-section-message";
import React from "react";
import { ReleaseIssuesContainer } from "./release-issues-container";
import { ReleaseIssuesBody } from "./release-issues-body";
import { useConfigurationStore } from "../../store/configuration-store";
import { FunctionKey } from "@lib/functions";
import { safeInvoke } from "@lib/safe-invoke";

async function getReleaseIssues(jql: string) {
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
	const { showOutOfScopeIssues } = useConfigurationStore();

	const { data: projectId } = useQuery({
		queryKey: ["project-id"],
		queryFn: () => safeInvoke(FunctionKey.GET_PROJECT_ID),
	});

	function getJql(projectId: string, showOutOfScopeIssues: boolean) {
		if (showOutOfScopeIssues) {
			return `(worklogDate >= "${selectedRelease?.startDate}" AND worklogDate <= "${selectedRelease?.releaseDate}" AND project = "${projectId}") OR fixVersion = "${selectedRelease?.name}"`;
		}
		return `fixVersion = "${selectedRelease?.name}"`;
	}

	const {
		data: issues,
		isLoading,
		isFetching,
		isError,
		refetch,
	} = useQuery({
		queryKey: [
			"release-issues",
			selectedRelease?.id,
			projectId,
			showOutOfScopeIssues,
		],
		queryFn: ({ queryKey }) => {
			const [_key, _releaseId, projectId, showOutOfScopeIssues] = queryKey;
			return getReleaseIssues(
				getJql(projectId as string, showOutOfScopeIssues as boolean),
			);
		},
		enabled: !!selectedRelease && !!projectId,
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
