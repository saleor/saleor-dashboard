import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppTypeEnum } from "@dashboard/graphql";

export interface PaymentAppConfigureTarget {
  id: string;
  type: AppTypeEnum | null;
  isActive: boolean | null;
  appUrl?: string | null;
}

export const resolvePaymentAppConfigureUrl = (app: PaymentAppConfigureTarget): string => {
  if (app.type === AppTypeEnum.LOCAL) {
    return ExtensionsUrls.editCustomExtensionUrl(app.id);
  }

  if (!app.isActive || !app.appUrl) {
    return ExtensionsUrls.resolveEditManifestExtensionUrl(app.id);
  }

  return ExtensionsUrls.resolveViewManifestExtensionUrl(app.id);
};
