import React from "react";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages, sectionNames } from "@saleor/intl";
import { useIntl } from "react-intl";

import { configurationMenuUrl } from "../../configuration";
import { getMutationState, maybe } from "../../misc";
import { AuthorizationKeyType } from "../../types/globalTypes";
import SiteSettingsKeyDialog, {
  SiteSettingsKeyDialogForm
} from "../components/SiteSettingsKeyDialog";
import SiteSettingsPage, {
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

export const SiteSettings: React.StatelessComponent<SiteSettingsProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleAddKeySuccess = (data: AuthorizationKeyAdd) => {
    if (!maybe(() => data.authorizationKeyAdd.errors.length)) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(siteSettingsUrl());
    }
  };
  const handleDeleteKeySuccess = (data: AuthorizationKeyDelete) => {
    if (!maybe(() => data.authorizationKeyDelete.errors.length)) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    } else {
      notify({
        text: intl.formatMessage(
          {
            defaultMessage: "Could not delete authorization key: {errorMessage}"
          },
          {
            errorMessage: data.authorizationKeyDelete.errors[0].message
          }
        )
      });
    }
  };
  const handleSiteSettingsSuccess = (data: ShopSettingsUpdate) => {
    if (
      (!data.shopDomainUpdate.errors ||
        data.shopDomainUpdate.errors.length === 0) &&
      (!data.shopSettingsUpdate.errors ||
        data.shopSettingsUpdate.errors.length === 0) &&
      (!data.shopAddressUpdate.errors ||
        data.shopAddressUpdate.errors.length === 0)
    ) {
      notify({
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
                      ...maybe(
                        () =>
                          updateShopSettingsOpts.data.shopDomainUpdate.errors,
                        []
                      ),
                      ...maybe(
                        () =>
                          updateShopSettingsOpts.data.shopSettingsUpdate.errors,
                        []
                      ),
                      ...maybe(
                        () =>
                          updateShopSettingsOpts.data.shopAddressUpdate.errors,
                        []
                      )
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
                    const handleUpdateShopSettings = (
                      data: SiteSettingsPageFormData
                    ) =>
                      updateShopSettings({
                        variables: {
                          addressInput: {
                            city: data.city,
                            companyName: data.companyName,
                            country: data.country,
                            countryArea: data.countryArea,
                            phone: data.phone,
                            postalCode: data.postalCode,
                            streetAddress1: data.streetAddress1,
                            streetAddress2: data.streetAddress2
                          },
                          shopDomainInput: {
                            domain: data.domain,
                            name: data.name
                          },
                          shopSettingsInput: {
                            description: data.description
                          }
                        }
                      });

                    const formTransitionState = getMutationState(
                      updateShopSettingsOpts.called,
                      updateShopSettingsOpts.loading,
                      [
                        ...maybe(
                          () =>
                            updateShopSettingsOpts.data.shopDomainUpdate.errors,
                          []
                        ),
                        ...maybe(
                          () =>
                            updateShopSettingsOpts.data.shopSettingsUpdate
                              .errors,
                          []
                        )
                      ]
                    );

                    return (
                      <>
                        <WindowTitle
                          title={intl.formatMessage(sectionNames.siteSettings)}
                        />
                        <SiteSettingsPage
                          disabled={loading}
                          errors={errors}
                          shop={maybe(() => siteSettings.data.shop)}
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
                          saveButtonBarState={formTransitionState}
                        />
                        <SiteSettingsKeyDialog
                          errors={maybe(
                            () =>
                              addAuthorizationKeyOpts.data.authorizationKeyAdd
                                .errors,
                            []
                          )}
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
