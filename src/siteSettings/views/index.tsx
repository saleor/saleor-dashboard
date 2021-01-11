import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages, sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { configurationMenuUrl } from "../../configuration";
import { findInEnum } from "../../misc";
import { AuthorizationKeyType, CountryCode } from "../../types/globalTypes";
import SiteSettingsKeyDialog, {
  SiteSettingsKeyDialogForm
} from "../components/SiteSettingsKeyDialog";
import SiteSettingsPage, {
  areAddressInputFieldsModified,
  SiteSettingsPageFormData
} from "../components/SiteSettingsPage";
import {
  TypedAuthorizationKeyAdd,
  TypedAuthorizationKeyDelete,
  TypedShopSettingsUpdate
} from "../mutations";
import { TypedSiteSettingsQuery } from "../queries";
import { AuthorizationKeyAdd } from "../types/AuthorizationKeyAdd";
import { AuthorizationKeyDelete } from "../types/AuthorizationKeyDelete";
import { ShopSettingsUpdate } from "../types/ShopSettingsUpdate";
import { siteSettingsUrl, SiteSettingsUrlQueryParams } from "../urls";

export interface SiteSettingsProps {
  params: SiteSettingsUrlQueryParams;
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleAddKeySuccess = (data: AuthorizationKeyAdd) => {
    if (data.authorizationKeyAdd.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(siteSettingsUrl());
    }
  };
  const handleDeleteKeySuccess = (data: AuthorizationKeyDelete) => {
    if (data.authorizationKeyDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    } else {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong)
      });
    }
  };
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
        <TypedAuthorizationKeyAdd onCompleted={handleAddKeySuccess}>
          {(addAuthorizationKey, addAuthorizationKeyOpts) => (
            <TypedAuthorizationKeyDelete onCompleted={handleDeleteKeySuccess}>
              {(deleteAuthorizationKey, _) => (
                <TypedShopSettingsUpdate
                  onCompleted={handleSiteSettingsSuccess}
                >
                  {(updateShopSettings, updateShopSettingsOpts) => {
                    const errors = [
                      ...(updateShopSettingsOpts.data?.shopDomainUpdate
                        .errors || []),
                      ...(updateShopSettingsOpts.data?.shopSettingsUpdate
                        .errors || []),
                      ...(updateShopSettingsOpts.data?.shopAddressUpdate
                        .errors || [])
                    ];
                    const loading =
                      siteSettings.loading ||
                      addAuthorizationKeyOpts.loading ||
                      updateShopSettingsOpts.loading;

                    const handleAuthenticationKeyAdd = (
                      data: SiteSettingsKeyDialogForm
                    ) =>
                      addAuthorizationKey({
                        variables: {
                          input: {
                            key: data.key,
                            password: data.password
                          },
                          keyType: data.type
                        }
                      });
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
                            defaultMailSenderAddress:
                              data.defaultMailSenderAddress,
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
                          onKeyAdd={() =>
                            navigate(
                              siteSettingsUrl({
                                action: "add-key"
                              })
                            )
                          }
                          onKeyRemove={keyType =>
                            deleteAuthorizationKey({
                              variables: { keyType }
                            })
                          }
                          onSubmit={handleUpdateShopSettings}
                          saveButtonBarState={updateShopSettingsOpts.status}
                        />
                        <SiteSettingsKeyDialog
                          errors={
                            addAuthorizationKeyOpts.data?.authorizationKeyAdd
                              .errors || []
                          }
                          initial={{
                            key: "",
                            password: "",
                            type: AuthorizationKeyType.FACEBOOK
                          }}
                          open={params.action === "add-key"}
                          onClose={() => navigate(siteSettingsUrl())}
                          onSubmit={handleAuthenticationKeyAdd}
                        />
                      </>
                    );
                  }}
                </TypedShopSettingsUpdate>
              )}
            </TypedAuthorizationKeyDelete>
          )}
        </TypedAuthorizationKeyAdd>
      )}
    </TypedSiteSettingsQuery>
  );
};
export default SiteSettings;
