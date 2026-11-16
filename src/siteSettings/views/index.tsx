import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CountryCode,
  type ShopErrorFragment,
  type ShopSettingsInput,
  useShopSettingsUpdateMutation,
  useSiteSettingsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { sectionNames } from "@dashboard/intl";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useIntl } from "react-intl";

import { extractMutationErrors, findInEnum } from "../../misc";
import { ShopMetadataDialog } from "../components/ShopMetadataDialog/ShopMetadataDialog";
import {
  areAddressInputFieldsModified,
  SiteSettingsPage,
  type SiteSettingsPageFormData,
} from "../components/SiteSettingsPage/SiteSettingsPage";
import { siteSettingsUrl, type SiteSettingsUrlQueryParams } from "../urls";

interface SiteSettingsProps {
  params: SiteSettingsUrlQueryParams;
}

const SiteSettings = ({ params }: SiteSettingsProps): React.ReactNode => {
  const notify = useNotifier();
  const navigate = useNavigator();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers(navigate, siteSettingsUrl, params);
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
        onShowMetadata={() => openModal("view-metadata")}
        onSubmit={handleUpdateShopSettings}
        saveButtonBarState={updateOpts.status}
      />
      <ShopMetadataDialog open={params.action === "view-metadata"} onClose={closeModal} />
    </>
  );
};

export default SiteSettings;
