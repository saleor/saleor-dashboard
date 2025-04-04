import { AppDisabledInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/AppDisabledInfo";
import { FailedInstallationActions } from "@dashboard/extensions/components/InstalledExtensionsList/componets/FailedInstallationActions";
import { FailedInstallationInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/FailedInstallationInfo";
import { FailedWebhookInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/FailedWebhookInfo";
import { InstallationPendingInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/InstallationPendingInfo";
import { ViewDetailsActionButton } from "@dashboard/extensions/components/InstalledExtensionsList/componets/ViewDetailsActionButton";
import { InstalledExtension } from "@dashboard/extensions/types";
import React from "react";

export const useInstalledExtensionsMocks = (): InstalledExtension[] => {
  return [
    {
      id: "QXBwOjI2MA==",
      name: "Adyen",
      logo: "https://pawel-shop.staging.saleor.cloud/thumbnail/QXBwOjQ1N2Y0YTU0LTYyNmEtNGY0ZC05NDMwLTQ3NjRhNWZiYjk1Yw==/64/webp/",
      info: <FailedWebhookInfo link="/" date="2025-04-02" />,
      actions: <ViewDetailsActionButton id="QXBwOjI2MA==" />,
    },
    {
      id: "QXBwOjI2MQ==",
      name: "CMS",
      logo: "https://pawel-shop.staging.saleor.cloud/thumbnail/QXBwOjYzOWExODBiLTI0ZGMtNDI0ZC04NzJlLWI4NDM5ODAzZjJjMw==/64/webp/",
      info: <AppDisabledInfo />,
      actions: <ViewDetailsActionButton isDisabled id="QXBwOjI2MA==" />,
    },
    {
      id: "QXBwOjI2Mg==",
      name: "Twilio Segment",
      logo: "https://pawel-shop.staging.saleor.cloud/thumbnail/QXBwOmE1ZDUyZTg4LWQxZjItNDRiMS1hZTcwLTdlMWQxMTAyZmJmNA==/64/webp/",
      info: <FailedInstallationInfo />,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      actions: <FailedInstallationActions onDelete={() => {}} onRetry={() => {}} />,
    },
    {
      id: "QXBwOjH2Mg==",
      name: "Product Feeds very long name",
      logo: "https://pawel-shop.staging.saleor.cloud/thumbnail/QXBwOmE1ZDUyZTg4LWQxZjItNDRiMS1hZTcwLTdlMWQxMTAyZmJmNA==/64/webp/",
      info: <InstallationPendingInfo />,
      actions: <ViewDetailsActionButton id={undefined} />,
    },
  ];
};
