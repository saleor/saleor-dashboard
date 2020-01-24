import { useState } from "react";
import {
  Breadcrumb,
  useExtensionMessage,
  ExtensionMessageEvent,
  ExtensionMessageType,
  BreadcrumbChangeMessage,
  sendMessageToExtension,
  BreadcrumbClickMessage
} from "@saleor/macaw-ui/extensions";

type UseExtensionBreadcrumbs = [Breadcrumb[], (value: string) => void];
function useExtensionBreadcrumbs(): UseExtensionBreadcrumbs {
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

export default useExtensionBreadcrumbs;
