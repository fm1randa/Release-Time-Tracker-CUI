import { Inline, Stack } from "@atlaskit/primitives";
import Spinner from "@atlaskit/spinner";
import { requestJira } from "@forge/bridge";
import { FunctionKey } from "@lib/functions";
import { safeInvoke } from "@lib/safe-invoke";
import { useQuery } from "@tanstack/react-query";
import type { Version } from "@typings/version";
import React from "react";
import { ErrorSectionMessage } from "./components/error-section-message";
import { ReleaseIssues } from "./components/release-issues";
import { ReleaseList } from "./components/release-list";

async function getProjectData(projectId: string) {
	const versions = await requestJira(
		`/rest/api/3/project/${projectId}/versions`,
	).then(async (response) => (await response.json()) as Version[]);

	return {
		versions,
	};
}

const App = () => {
	const {
		data: projectId,
		isLoading: isProjectIdPending,
		isError: isProjectIdError,
	} = useQuery({
		queryKey: ["project-id"],
		queryFn: () => safeInvoke(FunctionKey.GET_PROJECT_ID),
		retry: false,
	});

	const {
		data: projectData,
		isLoading: isProjectDataPending,
		isError: isProjectDataError,
		refetch,
	} = useQuery({
		queryKey: ["project-data"],
		queryFn: () => getProjectData(projectId as string),
		retry: false,
		enabled: !!projectId,
	});

	if (isProjectDataError || isProjectIdError) {
		return (
			<ErrorSectionMessage
				text="Could not fetch project data."
				onRetry={refetch}
			/>
		);
	}

	if (isProjectDataPending || isProjectIdPending) {
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
