import type { Issue } from "@typings/issue";
import { create } from "zustand";

interface IssueState {
	selectedIssue: Issue | null;
	setSelectedIssue: (issue: Issue) => void;
}

export const useIssueStore = create<IssueState>((set) => ({
	selectedIssue: null,
	setSelectedIssue: (issue: Issue) =>
		set({
			selectedIssue: issue,
		}),
}));
