import React from "react";
import Badge from "@atlaskit/badge";
import Button from "@atlaskit/button/new";
import Heading from "@atlaskit/heading";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import { Box, Inline, Stack, xcss } from "@atlaskit/primitives";
import Spinner from "@atlaskit/spinner";
import { useQuery } from "@tanstack/react-query";
import { formatSeconds } from "../lib/format-seconds";
import { FunctionKey } from "../lib/functions";
import { useIssueStore } from "../lib/issue-store";
import { useReleaseStore } from "../lib/release-store";
import { safeInvoke } from "../lib/safe-invoke";
import { Issue } from "../types/issue";
import { ErrorSectionMessage } from "./error-section-message";
import { useWorklogsModalStore, WorklogsModal } from "./worklogs-modal";
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

export function ReleaseIssues() {
  const { selectedRelease } = useReleaseStore();
  const { setSelectedIssue } = useIssueStore();
  const { openModal } = useWorklogsModalStore();

  const {
    data: issues,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["release-issues", selectedRelease?.id],
    queryFn: () => {
      return safeInvoke(FunctionKey.GET_RELEASE_ISSUES, {
        startDate: selectedRelease!.startDate,
        releaseDate: selectedRelease!.releaseDate,
      });
    },
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

  if (!selectedRelease || isLoading) {
    return <Spinner size={"medium"} />;
  }

  const { name, startDate, releaseDate } = selectedRelease;

  return (
    <Box
      xcss={xcss({
        borderColor: "color.border",
        borderWidth: "border.width",
        borderStyle: "solid",
        borderRadius: "border.radius",
      })}
      padding="space.100"
    >
      <Heading size="medium">
        <Inline>
          {name}
          <ChevronRightIcon label="Divider" size="medium" />
          Worked issues
          <Box
            xcss={xcss({
              height: "100%",
              paddingLeft: "space.150",
            })}
          >
            <Badge appearance="primary">
              {formatSeconds(getTotalWorkedSeconds(issues))}
            </Badge>
          </Box>
        </Inline>
      </Heading>
      <Box
        xcss={xcss({
          color: "color.text.subtlest",
          paddingBottom: "space.200",
        })}
      >
        {startDate} - {releaseDate}
      </Box>
      {issues ? (
        <Stack space="space.100">
          {issues.map((issue) => {
            const totalTimeSpentOnIssue: number = issue.worklogs.reduce(
              (acc, worklog) => {
                return acc + worklog.timeSpentSeconds;
              },
              0
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
      ) : (
        <EmptyState
          header={"No issues found for this release"}
          primaryAction={
            <Button appearance="primary" onClick={refetch}>
              Refresh
            </Button>
          }
        />
      )}
      <WorklogsModal />
    </Box>
  );
}
