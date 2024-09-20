import React from "react";
import SettingsIcon from "@atlaskit/icon/glyph/settings";
import { useConfigModalStore } from "./configuration-modal";
import { Pressable, xcss } from "@atlaskit/primitives";

export function ConfigurationButton() {
	const { openModal: openConfigurationModal } = useConfigModalStore();

	return (
		<Pressable
			onClick={openConfigurationModal}
			placeholder={undefined}
			onPointerEnterCapture={undefined}
			onPointerLeaveCapture={undefined}
			xcss={xcss({
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "color.background.neutral.subtle",
				borderRadius: "50%",
				width: "36px",
				height: "36px",

				":hover": {
					backgroundColor: "color.background.neutral.subtle.hovered",
				},
				":active": {
					backgroundColor: "color.background.neutral.subtle.pressed",
				},
			})}
		>
			<SettingsIcon label="Settings" />
		</Pressable>
	);
}
