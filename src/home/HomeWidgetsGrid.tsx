import { type Extension } from "@dashboard/extensions/types";
import { Box } from "@saleor/macaw-ui-next";

import { HomeWidgetCell } from "./HomeWidgetCell";

interface HomeWidgetsGridProps {
  extensions: Extension[];
}

export const HomeWidgetsGrid = ({ extensions }: HomeWidgetsGridProps) => (
  <Box
    display="grid"
    gap={6}
    width="100%"
    __gridTemplateColumns="1fr 1fr"
    data-test-id="home-widgets-grid"
  >
    {extensions.map(extension => (
      <HomeWidgetCell key={extension.id} extension={extension} />
    ))}
  </Box>
);
