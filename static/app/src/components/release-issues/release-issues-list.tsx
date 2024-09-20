import type { Issue } from "@typings/issue";
import { useIssueStore } from "../../store/issue-store";
import { useWorklogsModalStore } from "../worklogs-modal";
import EmptyState from "@atlaskit/empty-state";
import Button from "@atlaskit/button/new";
import React from "react";
import { Box, Inline, Stack, xcss } from "@atlaskit/primitives";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Badge from "@atlaskit/badge";
import { formatSeconds } from "@lib/format-seconds";
import { useConfigurationStore } from "../../store/configuration-store";

export function ReleaseIssuesList({
	issues,
	refetchIssues: refetch,
	isFetching,
}: { issues: Issue[]; refetchIssues: () => void; isFetching: boolean }) {
	const { setSelectedIssue } = useIssueStore();
	const { openModal } = useWorklogsModalStore();
	const { showIssuesNoWorklogs } = useConfigurationStore();

	const worklogFilter = (issue: Issue) => {
		return showIssuesNoWorklogs || issue.worklogs.length > 0;
	};

	if (!issues?.length) {
		return (
			<EmptyState
				header={"No issues found for this release"}
				primaryAction={
					<Button
						appearance="primary"
						onClick={() => refetch()}
						isDisabled={isFetching}
					>
						Refresh
					</Button>
				}
			/>
		);
	}

	return (
		<Stack space="space.100">
			{issues.filter(worklogFilter).map((issue) => {
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
