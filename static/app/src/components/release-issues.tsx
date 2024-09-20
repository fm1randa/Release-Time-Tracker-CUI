import Badge from "@atlaskit/badge";
import Button from "@atlaskit/button/new";
import Heading from "@atlaskit/heading";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import { Box, Inline, Stack, xcss } from "@atlaskit/primitives";
import Spinner from "@atlaskit/spinner";
import { requestJira } from "@forge/bridge";
import { formatSeconds } from "@lib/format-seconds";
import { useQuery } from "@tanstack/react-query";
import type { Issue, IssueResponse } from "@typings/issue";
import queryString from "query-string";
import React, { Fragment, type PropsWithChildren } from "react";
import { useIssueStore } from "../store/issue-store";
import { useReleaseStore } from "../store/release-store";
import { ErrorSectionMessage } from "./error-section-message";
import { WorklogsModal, useWorklogsModalStore } from "./worklogs-modal";

import EmptyState from "@atlaskit/empty-state";

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

function ReleaseIssuesContainer({ children }: PropsWithChildren) {
	return (
		<Box
			xcss={xcss({
				borderColor: "color.border",
				borderWidth: "border.width",
				borderStyle: "solid",
				borderRadius: "border.radius",
				position: "relative",
			})}
			padding="space.100"
		>
			{children}
		</Box>
	);
}

function ReleaseIssuesHeading({
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

function ReleaseIssuesSubHeading({
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

function ReleaseIssuesList({
	issues,
	refetchIssues: refetch,
}: { issues: Issue[]; refetchIssues: () => void }) {
	const { setSelectedIssue } = useIssueStore();
	const { openModal } = useWorklogsModalStore();

	if (!issues?.length) {
		return (
			<EmptyState
				header={"No issues found for this release"}
				primaryAction={
					<Button appearance="primary" onClick={() => refetch()}>
						Refresh
					</Button>
				}
			/>
		);
	}

	return (
		<Stack space="space.100">
			{issues.map((issue) => {
				const totalTimeSpentOnIssue: number = issue.worklogs.reduce(
					(acc, worklog) => {
						return acc + worklog.timeSpentSeconds;
					},
					0,
				);

				return (
					<Button
						onClick={() => {
							setSelectedIssue(issue);
							openModal();
						}}
						key={issue.id}
					>
						<Inline space="space.100">
							<Stack grow="hug">{issue.issueKey}</Stack>

							<Box xcss={xcss({ height: "100%", paddingTop: "space.050" })}>
								<ChevronRightIcon label="Divider" size="medium" />
							</Box>

							<Stack grow="hug">{issue.summary}</Stack>
							<Stack grow="fill">
								<Inline alignInline="end" alignBlock="center">
									<Box xcss={xcss({ height: "100%" })}>
										<Badge>{formatSeconds(totalTimeSpentOnIssue)}</Badge>
									</Box>
								</Inline>
							</Stack>
						</Inline>
					</Button>
				);
			})}
		</Stack>
	);
}

function ReleaseIssuesFetchingSpinner({ isFetching }: { isFetching: boolean }) {
	if (!isFetching) {
		return null;
	}
	return (
		<div style={{ position: "absolute", top: "10px", right: "10px" }}>
			<Spinner />
		</div>
	);
}

function ReleaseIssuesBody({
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
		return <Spinner size={"medium"} />;
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
			<ReleaseIssuesList issues={issues} refetchIssues={refetch} />
			<WorklogsModal />
		</Fragment>
	);
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
