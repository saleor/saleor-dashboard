import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CountryCode,
  type ShopErrorFragment,
  type ShopSettingsInput,
  useShopSettingsUpdateMutation,
  useSiteSettingsQuery,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { sectionNames } from "@dashboard/intl";
import { useIntl } from "react-intl";

import { extractMutationErrors, findInEnum } from "../../misc";
import SiteSettingsPage, {
  areAddressInputFieldsModified,
  type SiteSettingsPageFormData,
} from "../components/SiteSettingsPage";

const SiteSettings = () => {
  const notify = useNotifier();
  const intl = useIntl();
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
        text: intl.formatMessage({ id: "jvz9Mr", defaultMessage: "Site settings updated" }),
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
      description: data.description,
      reserveStockDurationAnonymousUser: data.reserveStockDurationAnonymousUser || null,
      reserveStockDurationAuthenticatedUser: data.reserveStockDurationAuthenticatedUser || null,
      enableAccountConfirmationByEmail: data.emailConfirmation,
      limitQuantityPerCheckout: data.limitQuantityPerCheckout || null,
      useLegacyUpdateWebhookEmission: data.useLegacyUpdateWebhookEmission,
      useLegacyShippingZoneStockAvailability: data.useLegacyShippingZoneStockAvailability,
      preserveAllAddressFields: data.preserveAllAddressFields,
      passwordLoginMode: data.passwordLoginMode,
    };

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
