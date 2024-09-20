import Button from "@atlaskit/button/new";
import DynamicTable from "@atlaskit/dynamic-table";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import Tooltip from "@atlaskit/tooltip";
import { formatSeconds } from "@lib/format-seconds";
import React from "react";
import { create } from "zustand";
import { useIssueStore } from "../store/issue-store";
import EmptyState from "@atlaskit/empty-state";

function formatTimeAgo(dateString: string) {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const intervals = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60,
		second: 1,
	};

	for (const [key, value] of Object.entries(intervals)) {
		const interval = Math.floor(seconds / value);
		if (interval >= 1) {
			return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
		}
	}

	return "Just now";
}

interface WorklogsModalState {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

export const useWorklogsModalStore = create<WorklogsModalState>((set) => ({
	isOpen: false,
	openModal: () => set(() => ({ isOpen: true })),
	closeModal: () => set(() => ({ isOpen: false })),
}));

export function WorklogsModal() {
	const { isOpen, closeModal } = useWorklogsModalStore();
	const { selectedIssue } = useIssueStore();

	const head = {
		cells: [
			{
				key: "author-column",
				content: "Author",
				isSortable: true,
			},
			{
				key: "time-spent-column",
				content: "Time Spent",
				isSortable: true,
			},
			{
				key: "date-started-column",
				content: "Date Started",
				isSortable: true,
			},
			{
				key: "date-updated-column",
				content: "Date Updated",
				isSortable: true,
			},
		],
	};
	const rows = selectedIssue?.worklogs.map((worklog, index) => {
		const BASE_KEY = `row-${index}-${worklog.id}`;
		return {
			key: BASE_KEY,
			cells: [
				{
					key: `${BASE_KEY}-author`,
					content: worklog.author.displayName,
				},
				{
					key: `${BASE_KEY}-time-spent`,
					content: formatSeconds(worklog.timeSpentSeconds),
				},
				{
					key: `${BASE_KEY}-date-started`,
					content: (
						<Tooltip content={worklog.started} position="mouse">
							{formatTimeAgo(worklog.started)}
						</Tooltip>
					),
				},
				{
					key: `${BASE_KEY}-date-updated`,
					content: (
						<Tooltip content={worklog.updated}>
							{formatTimeAgo(worklog.updated)}
						</Tooltip>
					),
				},
			],
		};
	});

	return (
		<ModalTransition>
			{isOpen && (
				<Modal onClose={closeModal} width={"large"}>
					<ModalHeader>
						<ModalTitle>
							{selectedIssue?.issueKey}
							<ChevronRightIcon label="Divider" size="medium" />
							Worklogs
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						{rows?.length ? (
							<DynamicTable head={head} rows={rows} />
						) : (
							<EmptyState header={"No worklogs found for this issue"} />
						)}
					</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={closeModal}>
							Close
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
}
