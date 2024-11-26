import { Box } from "@saleor/macaw-ui-next";
import { usePostHog } from "posthog-js/react";
import React from "react";
import { useIntl } from "react-intl";

import { getTilesData } from "./tileData";
import { WelcomePageInfoTile } from "./WelcomePageInfoTile";

export const WelcomePageTilesContainer = () => {
  const intl = useIntl();
  const posthog = usePostHog();

  const handleTileButtonClick = (tileId: string) => {
    posthog.capture("home_tile_click", {
      tile_id: tileId,
    });
  };

  const tiles = getTilesData({ intl, onTileButtonClick: handleTileButtonClick });

  return (
    <Box
      display="grid"
      __gridTemplateColumns="repeat(auto-fill, minmax(min(100%, 400px), 1fr))"
      gap={6}
      marginTop={7}
    >
      {tiles.map(tile => (
        <WelcomePageInfoTile key={tile.id} {...tile} />
      ))}
    </Box>
  );
};
