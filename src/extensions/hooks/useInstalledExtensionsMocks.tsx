import { AppDisabledInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/AppDisabledInfo";
import { InstalledExtension } from "@dashboard/extensions/types";
import React from "react";

export const useInstalledExtensionsMocks = (): InstalledExtension[] => {
  return [
    {
      id: "QXBwOjI2MA==",
      name: "Adyen",
      logo: "https://pawel-shop.staging.saleor.cloud/thumbnail/QXBwOjQ1N2Y0YTU0LTYyNmEtNGY0ZC05NDMwLTQ3NjRhNWZiYjk1Yw==/64/webp/",
      info: null,
      actions: null,
    },
    {
      id: "QXBwOjI2MQ==",
      name: "CMS",
      logo: "https://pawel-shop.staging.saleor.cloud/thumbnail/QXBwOjYzOWExODBiLTI0ZGMtNDI0ZC04NzJlLWI4NDM5ODAzZjJjMw==/64/webp/",
      info: <AppDisabledInfo />,
      actions: null,
    },
    {
      id: "QXBwOjI2Mg==",
      name: "Twilio Segment",
      logo: "https://pawel-shop.staging.saleor.cloud/thumbnail/QXBwOmE1ZDUyZTg4LWQxZjItNDRiMS1hZTcwLTdlMWQxMTAyZmJmNA==/64/webp/",
      info: null,
      actions: null,
    },
  ];
};
