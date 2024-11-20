import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeInfoTile } from "./HomeInfoTile";
import { getTilesData } from "./tileData";

export const HomeTilesContainer: React.FC = () => {
  const intl = useIntl();

  const tiles = getTilesData({ intl });

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        mobile: 1,
        desktop: 2,
      }}
      padding={2}
    >
      {tiles.map(tile => (
        <HomeInfoTile key={tile.id} {...tile} />
      ))}
    </Box>
  );
};
