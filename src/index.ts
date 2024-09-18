import { FunctionKey } from "./lib/functions";
import { SafeResolver } from "./lib/safe-resolver";
import { IssueResponse } from "./types/issue";
import { Version } from "./types/version";
import api, { route } from "@forge/api";
import queryString from "query-string";

const resolver = new SafeResolver();

resolver.define(FunctionKey.GET_PROJECT_DATA, async (req) => {
  const {
    context: {
      extension: {
        project: { id: projectId },
      },
    },
  } = req;

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
    context: {
      extension: {
        project: { id: projectId },
      },
    },
  } = req;

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
