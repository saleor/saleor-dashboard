import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CountryCode,
  type ShopErrorFragment,
  type ShopSettingsInput,
  useShopSettingsUpdateMutation,
  useSiteSettingsQuery,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { sectionNames } from "@dashboard/intl";
import { useIntl } from "react-intl";

import { extractMutationErrors, findInEnum } from "../../misc";
import {
  areAddressInputFieldsModified,
  SiteSettingsPage,
  type SiteSettingsPageFormData,
} from "../components/SiteSettingsPage/SiteSettingsPage";

const SiteSettings = () => {
  const notify = useNotifier();
  const intl = useIntl();
  const { trackEvent } = useAnalytics();
  const siteSettings = useSiteSettingsQuery({
    displayLoader: true,
  });

  const onUpdateCompleted = (data: {
    shopSettingsUpdate?: { errors: unknown[] } | null;
    shopAddressUpdate?: { errors: unknown[] } | null;
  }) => {
    if (
      [...(data?.shopAddressUpdate?.errors || []), ...(data?.shopSettingsUpdate?.errors || [])]
        .length === 0
    ) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "I6Bv55",
          defaultMessage: "Store settings updated",
          description: "success notification after saving store settings",
        }),
      });
    }
  };

  const [updateShopSettings, updateOpts] = useShopSettingsUpdateMutation({
    onCompleted: onUpdateCompleted,
  });

  // Staging schema errors have a superset of ShopErrorCode values,
  // but they share the same shape (code, field, message) used by UI components.
  const errors = [
    ...(updateOpts.data?.shopSettingsUpdate?.errors || []),
    ...(updateOpts.data?.shopAddressUpdate?.errors || []),
  ] as ShopErrorFragment[];
  const loading = siteSettings.loading || updateOpts.loading;
  const handleUpdateShopSettings = async (data: SiteSettingsPageFormData) => {
    const addressInput = areAddressInputFieldsModified(data)
      ? {
          city: data.city,
          companyName: data.companyName,
          country: findInEnum(data.country, CountryCode),
          countryArea: data.countryArea,
          phone: data.phone,
          postalCode: data.postalCode,
          streetAddress1: data.streetAddress1,
          streetAddress2: data.streetAddress2,
        }
      : {
          companyName: data.companyName,
        };

    const shopSettingsInput: ShopSettingsInput = {
      name: data.name,
      description: data.description,
      enableAccountConfirmationByEmail: data.emailConfirmation,
      useLegacyUpdateWebhookEmission: data.useLegacyUpdateWebhookEmission,
      useLegacyShippingZoneStockAvailability: data.useLegacyShippingZoneStockAvailability,
      preserveAllAddressFields: data.preserveAllAddressFields,
      passwordLoginMode: data.passwordLoginMode,
      allowStorefrontTraffic: data.allowStorefrontTraffic,
    };

    // useLegacyUpdateWebhookEmission is deprecated in the API - track who still changes it.
    if (
      data.useLegacyUpdateWebhookEmission !==
      (siteSettings.data?.shop?.useLegacyUpdateWebhookEmission ?? true)
    ) {
      trackEvent("shop_legacy_update_webhook_emission_submitted");
    }

    return extractMutationErrors(
      updateShopSettings({
        variables: { addressInput, shopSettingsInput },
      }),
    );
  };

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.siteSettings)} />
      <SiteSettingsPage
        disabled={loading}
        errors={errors}
        shop={siteSettings.data?.shop}
        onSubmit={handleUpdateShopSettings}
        saveButtonBarState={updateOpts.status}
      />
    </>
  );
};

export default SiteSettings;
