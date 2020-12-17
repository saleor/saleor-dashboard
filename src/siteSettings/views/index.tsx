import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages, sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { configurationMenuUrl } from "../../configuration";
import { findInEnum } from "../../misc";
import { CountryCode } from "../../types/globalTypes";
import SiteSettingsPage, {
  areAddressInputFieldsModified,
  SiteSettingsPageFormData
} from "../components/SiteSettingsPage";
import { TypedShopSettingsUpdate } from "../mutations";
import { TypedSiteSettingsQuery } from "../queries";
import { ShopSettingsUpdate } from "../types/ShopSettingsUpdate";
import { SiteSettingsUrlQueryParams } from "../urls";

export interface SiteSettingsProps {
  params: SiteSettingsUrlQueryParams;
}

export const SiteSettings: React.FC<SiteSettingsProps> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleSiteSettingsSuccess = (data: ShopSettingsUpdate) => {
    if (
      data.shopDomainUpdate.errors.length === 0 &&
      data.shopSettingsUpdate.errors.length === 0 &&
      data.shopAddressUpdate.errors.length === 0
    ) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  return (
    <TypedSiteSettingsQuery displayLoader>
      {siteSettings => (
        <TypedShopSettingsUpdate onCompleted={handleSiteSettingsSuccess}>
          {(updateShopSettings, updateShopSettingsOpts) => {
            const errors = [
              ...(updateShopSettingsOpts.data?.shopDomainUpdate.errors || []),
              ...(updateShopSettingsOpts.data?.shopSettingsUpdate.errors || []),
              ...(updateShopSettingsOpts.data?.shopAddressUpdate.errors || [])
            ];
            const loading =
              siteSettings.loading || updateShopSettingsOpts.loading;

            const handleUpdateShopSettings = async (
              data: SiteSettingsPageFormData
            ) => {
              const addressInput = areAddressInputFieldsModified(data)
                ? {
                    city: data.city,
                    companyName: data.companyName,
                    country: findInEnum(data.country, CountryCode),
                    countryArea: data.countryArea,
                    phone: data.phone,
                    postalCode: data.postalCode,
                    streetAddress1: data.streetAddress1,
                    streetAddress2: data.streetAddress2
                  }
                : {
                    companyName: data.companyName
                  };
              const result = await updateShopSettings({
                variables: {
                  addressInput,
                  shopDomainInput: {
                    domain: data.domain,
                    name: data.name
                  },
                  shopSettingsInput: {
                    customerSetPasswordUrl: data.customerSetPasswordUrl,
                    defaultMailSenderAddress: data.defaultMailSenderAddress,
                    defaultMailSenderName: data.defaultMailSenderName,
                    description: data.description
                  }
                }
              });

              return [
                ...result.data.shopAddressUpdate.errors,
                ...result.data.shopDomainUpdate.errors,
                ...result.data.shopSettingsUpdate.errors
              ];
            };

            return (
              <>
                <WindowTitle
                  title={intl.formatMessage(sectionNames.siteSettings)}
                />
                <SiteSettingsPage
                  disabled={loading}
                  errors={errors}
                  shop={siteSettings.data?.shop}
                  onBack={() => navigate(configurationMenuUrl)}
                  onSubmit={handleUpdateShopSettings}
                  saveButtonBarState={updateShopSettingsOpts.status}
                />
              </>
            );
          }}
        </TypedShopSettingsUpdate>
      )}
    </TypedSiteSettingsQuery>
  );
};
export default SiteSettings;
