import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  CountryCode,
  useShopSettingsUpdateMutation,
  useSiteSettingsQuery,
} from "@saleor/graphql";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages, sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, findInEnum } from "../../misc";
import SiteSettingsPage, {
  areAddressInputFieldsModified,
  SiteSettingsPageFormData,
} from "../components/SiteSettingsPage";
import { SiteSettingsUrlQueryParams } from "../urls";

export interface SiteSettingsProps {
  params: SiteSettingsUrlQueryParams;
}

export const SiteSettings: React.FC<SiteSettingsProps> = () => {
  const notify = useNotifier();
  const intl = useIntl();

  const siteSettings = useSiteSettingsQuery({
    displayLoader: true,
  });

  const [
    updateShopSettings,
    updateShopSettingsOpts,
  ] = useShopSettingsUpdateMutation({
    onCompleted: data => {
      if (
        [...data.shopAddressUpdate.errors, ...data.shopSettingsUpdate.errors]
          .length === 0
      ) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const errors = [
    ...(updateShopSettingsOpts.data?.shopSettingsUpdate.errors || []),
    ...(updateShopSettingsOpts.data?.shopAddressUpdate.errors || []),
  ];
  const loading = siteSettings.loading || updateShopSettingsOpts.loading;

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

    return extractMutationErrors(
      updateShopSettings({
        variables: {
          addressInput,
          shopSettingsInput: {
            description: data.description,
            reserveStockDurationAnonymousUser:
              data.reserveStockDurationAnonymousUser || null,
            reserveStockDurationAuthenticatedUser:
              data.reserveStockDurationAuthenticatedUser || null,
          },
        },
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
        saveButtonBarState={updateShopSettingsOpts.status}
      />
    </>
  );
};
export default SiteSettings;
