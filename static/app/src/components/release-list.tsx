import React, { useEffect } from "react";
import { Box, Inline, Stack, xcss } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Button from "@atlaskit/button/new";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import { Version } from "../types/version";
import { useReleaseStore } from "../lib/release-store";

export function ReleaseList({ versions }: { versions: Version[] }) {
  const { selectedRelease, setSelectedRelease } = useReleaseStore();

  useEffect(() => {
    if (selectedRelease) return;
    const { id, name, startDate, releaseDate } = versions[0];

    setSelectedRelease({
      id,
      name,
      startDate,
      releaseDate,
    });
  }, [selectedRelease, setSelectedRelease, versions]);

  const boxStyles = xcss({
    width: "250px",
    borderColor: "color.border",
    borderWidth: "border.width",
    borderStyle: "solid",
    borderRadius: "border.radius",
  });

  return (
    <Box xcss={boxStyles} padding="space.100">
      <Stack space="space.100">
        <Heading size="medium">Releases</Heading>
        {versions.map(({ id, name, startDate, releaseDate }) => (
          <Button
            isSelected={id === selectedRelease?.id}
            onClick={() =>
              setSelectedRelease({ id, name, startDate, releaseDate })
            }
            key={id}
          >
            <Inline alignBlock="center">
              <ChevronRightIcon label="View worklogs" />
              {name}
            </Inline>
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
