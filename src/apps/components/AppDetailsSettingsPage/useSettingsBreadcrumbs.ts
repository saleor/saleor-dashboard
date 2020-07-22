import {
  Breadcrumb,
  BreadcrumbChangeMessage,
  BreadcrumbClickMessage,
  ExtensionMessageEvent,
  ExtensionMessageType,
  sendMessageToExtension,
  useExtensionMessage
} from "@saleor/macaw-ui/extensions";
import { useState } from "react";

type UseSettingsBreadcrumbs = [Breadcrumb[], (value: string) => void];
function useSettingsBreadcrumbs(): UseSettingsBreadcrumbs {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const handleBreadcrumbSet = (
    event: ExtensionMessageEvent<BreadcrumbChangeMessage>
  ) => {
    if (event.data.type === ExtensionMessageType.BREADCRUMB_SET) {
      setBreadcrumbs(event.data.breadcrumbs);
    }
  };

  useExtensionMessage(handleBreadcrumbSet);

  const handleBreadcrumbClick = (value: string) =>
    sendMessageToExtension<BreadcrumbClickMessage>(
      {
        breadcrumb: value,
        type: ExtensionMessageType.BREADCRUMB_CLICK
      },
      "*"
    );

  return [breadcrumbs, handleBreadcrumbClick];
}

export default useSettingsBreadcrumbs;
