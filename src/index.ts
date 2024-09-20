import api, { route } from "@forge/api";
import queryString from "query-string";
import { FunctionKey } from "./lib/functions";
import { SafeResolver } from "./lib/safe-resolver";
import type { IssueResponse } from "./types/issue";
import type { Version } from "./types/version";

const resolver = new SafeResolver();

resolver.define(FunctionKey.GET_PROJECT_ID, async (req) => {
	const {
		context: { extension },
	} = req;

	const {
		project: { id: projectId },
	} = extension as {
		project: {
			id: string;
		};
	};

	return projectId;
});

resolver.define(FunctionKey.GET_PROJECT_DATA, async (req) => {
	const {
		context: { extension },
	} = req;

	const {
		project: { id: projectId },
	} = extension as {
		project: {
			id: string;
		};
	};

	const versions = await api
		.asApp()
		.requestJira(route`/rest/api/3/project/${projectId}/versions`)
		.then(async (response) => (await response.json()) as Version[]);

	return {
		versions,
	};
});

resolver.define(FunctionKey.GET_RELEASE_ISSUES, async (req) => {
	const {
		payload: { startDate, releaseDate },
	} = req;

	const {
		context: { extension },
	} = req;

	const {
		project: { id: projectId },
	} = extension as {
		project: {
			id: string;
		};
	};

	const jql = `worklogDate >= "${startDate}" AND worklogDate <= "${releaseDate}" AND project = ${projectId}`;
	const params = queryString.stringify({ jql });

	const issuesResponse = await api
		.asApp()
		.requestJira(route`/rest/api/3/search?fields=summary,worklog&${params}`)
		.then(async (response) => (await response.json()) as IssueResponse);

	return issuesResponse.issues.map((issue) => ({
		id: issue.id,
		issueKey: issue.key,
		summary: issue.fields.summary,
		worklogs: issue.fields.worklog.worklogs,
	}));
});

export const handler = resolver.getDefinitions();
