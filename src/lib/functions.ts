import type { Issue } from "../types/issue";
import type { Version } from "../types/version";

export enum FunctionKey {
	GET_PROJECT_ID = "getProjectId",
	GET_PROJECT_DATA = "getProjectDate",
	GET_RELEASE_ISSUES = "getReleaseIssues",
}

export type RegisteredFunctions = {
	[FunctionKey.GET_PROJECT_DATA]: {
		returnType: Promise<{
			versions: Version[];
		}>;
		payloadType: undefined;
	};
	[FunctionKey.GET_RELEASE_ISSUES]: {
		returnType: Promise<Issue[]>;
		payloadType: {
			startDate: string;
			releaseDate: string;
		};
	};
	[FunctionKey.GET_PROJECT_ID]: {
		returnType: Promise<string>;
		payloadType: undefined;
	};
};
