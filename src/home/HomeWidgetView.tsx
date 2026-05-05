import { type Extension } from "@dashboard/extensions/types";

import { ExtensionIframe } from "./ExtensionIframe";

interface HomeWidgetViewProps {
  extension: Extension;
}

export const HomeWidgetView = ({ extension }: HomeWidgetViewProps) => (
  <ExtensionIframe extension={extension} height="100%" loaderType="throbber" />
);
