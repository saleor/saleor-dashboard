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
      gridTemplateColumns={{
        mobile: 1,
        desktop: 2,
      }}
      gap={6}
      marginRight={6}
      marginY={6}
      paddingBottom={6}
    >
      {tiles.map(tile => (
        <WelcomePageInfoTile key={tile.id} {...tile} />
      ))}
    </Box>
  );
};
