import React, { type PropsWithChildren } from "react";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import Toggle from "@atlaskit/toggle";
import { Label } from "@atlaskit/form";
import { create } from "zustand";
import Button from "@atlaskit/button/new";
import { useConfigurationStore } from "../store/configuration-store";
import { Inline, xcss } from "@atlaskit/primitives";
import "./configuration-modal.css";

interface ConfigurationModalState {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

function Option({ children }: PropsWithChildren) {
	return (
		<Inline
			space="space.050"
			xcss={xcss({
				alignItems: "center",
			})}
		>
			{children}
		</Inline>
	);
}

export const useConfigModalStore = create<ConfigurationModalState>((set) => ({
	isOpen: false,
	openModal: () => set(() => ({ isOpen: true })),
	closeModal: () => set(() => ({ isOpen: false })),
}));

function ConfigurationModalContent() {
	const {
		showIssuesNoWorklogs,
		showOutOfScopeIssues,
		setShowIssuesNoWorklogs,
		setShowOutOfScopeIssues,
	} = useConfigurationStore();
	const { isOpen, closeModal } = useConfigModalStore();

	if (!isOpen) {
		return null;
	}

	return (
		<Modal onClose={closeModal}>
			<ModalHeader>
				<ModalTitle>Configuration</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<Option>
					<Toggle
						id="show-out-of-scope-issues"
						isChecked={showOutOfScopeIssues}
						onChange={() => setShowOutOfScopeIssues(!showOutOfScopeIssues)}
					/>
					<Label
						htmlFor="show-out-of-scope-issues"
						id="label-show-out-of-scope-issues"
					>
						Show issues out of release scope
					</Label>
				</Option>
				<Option>
					<Toggle
						id="show-issues-no-worklogs"
						isChecked={showIssuesNoWorklogs}
						onChange={() => setShowIssuesNoWorklogs(!showIssuesNoWorklogs)}
					/>
					<Label
						htmlFor="show-issues-no-worklogs"
						id="label-show-issues-no-worklogs"
					>
						Show issues with no worklogs
					</Label>
				</Option>
			</ModalBody>
			<ModalFooter>
				<Button onClick={closeModal} appearance="subtle">
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export function ConfigurationModal() {
	return (
		<ModalTransition>
			<ConfigurationModalContent />
		</ModalTransition>
	);
}
