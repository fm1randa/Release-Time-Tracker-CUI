import Button from "@atlaskit/button/new";
import { Stack, Text } from "@atlaskit/primitives";
import SectionMessage from "@atlaskit/section-message";
import React from "react";

export function ErrorSectionMessage({
	text,
	onRetry,
}: {
	text: string;
	onRetry: () => void;
}) {
	return (
		<Stack space="space.100">
			<SectionMessage appearance="error">
				<Text>{text}</Text>
			</SectionMessage>
			<Button onClick={onRetry}>Retry</Button>
		</Stack>
	);
}
