import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { getTilesData } from "./tileData";
import { WelcomePageInfoTile } from "./WelcomePageInfoTile";

export const WelcomePageTilesContainer = () => {
  const intl = useIntl();

  const tiles = getTilesData({ intl });

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
