import React from "react";
import { useQuery } from "@tanstack/react-query";
import { safeInvoke } from "./lib/safe-invoke";
import { FunctionKey } from "./lib/functions";
import { ErrorSectionMessage } from "./components/error-section-message";
import { Inline, Stack } from "@atlaskit/primitives";
import Spinner from "@atlaskit/spinner";
import { ReleaseList } from "./components/release-list";
import { ReleaseIssues } from "./components/release-issues";

const App = () => {
  const {
    data: projectData,
    isLoading: isProjectDataPending,
    isError: isProjectDataError,
    refetch,
  } = useQuery({
    queryKey: ["project-data"],
    queryFn: () => safeInvoke(FunctionKey.GET_PROJECT_DATA),
    retry: false,
  });

  if (isProjectDataError) {
    return (
      <ErrorSectionMessage
        text="Could not fetch project data."
        onRetry={refetch}
      />
    );
  }

  if (isProjectDataPending) {
    return (
      <Inline alignBlock="center" alignInline="center">
        <Spinner size={"xlarge"} />
      </Inline>
    );
  }

  return (
    <Inline space="space.100">
      <Stack>
        <ReleaseList versions={projectData.versions} />
      </Stack>
      <Stack grow="fill">
        <ReleaseIssues />
      </Stack>
    </Inline>
  );
};

export default App;
