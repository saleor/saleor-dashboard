import { AppWidgetCard } from "@dashboard/extensions/components/AppWidgetCard/AppWidgetCard";
import { InlineExtensionPreferenceControls } from "@dashboard/extensions/preferences/InlineExtensionPreferenceControls";
import { type Extension } from "@dashboard/extensions/types";

import { ExtensionIframe } from "./ExtensionIframe";

interface HomeWidgetCellProps {
  extension: Extension;
}

const MIN_CELL_HEIGHT = 320;

export const HomeWidgetCell = ({ extension }: HomeWidgetCellProps) => (
  <AppWidgetCard
    extension={extension}
    contentMinHeight={MIN_CELL_HEIGHT}
    headerActions={<InlineExtensionPreferenceControls extension={extension} />}
  >
    <ExtensionIframe extension={extension} height="100%" loaderType="skeleton" />
  </AppWidgetCard>
);
