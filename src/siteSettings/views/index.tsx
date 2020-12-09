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
  useAuthorizationKeyAdd,
  useAuthorizationKeyDelete,
  useShopSettingsUpdate
} from "../mutations";
import { useSiteSettingsQuery } from "../queries";
import { siteSettingsUrl, SiteSettingsUrlQueryParams } from "../urls";

export interface SiteSettingsProps {
  params: SiteSettingsUrlQueryParams;
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const {
    data: siteSettingsQueryData,
    loading: siteSettingsQueryLoading
  } = useSiteSettingsQuery({
    displayLoader: true,
    variables: {}
  });

  const [authorizationKeyAdd, authorizationKeyAddOpts] = useAuthorizationKeyAdd(
    {
      onCompleted: data => {
        if (data.authorizationKeyAdd.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges)
          });
          navigate(siteSettingsUrl());
        }
      }
    }
  );

  const [authorizationKeyDelete] = useAuthorizationKeyDelete({
    onCompleted: data => {
      if (data.authorizationKeyDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(siteSettingsUrl());
      }
    }
  });

  const [shopSettingsUpdate, shopSettingsUpdateOpts] = useShopSettingsUpdate({
    onCompleted: data => {
      if (
        data.shopDomainUpdate.errors.length === 0 &&
        data.shopSettingsUpdate.errors.length === 0 &&
        data.shopAddressUpdate.errors.length === 0
      ) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(siteSettingsUrl());
      }
    }
  });

  const handleAuthorizationKeyAdd = async (data: SiteSettingsKeyDialogForm) => {
    authorizationKeyAdd({
      variables: {
        input: {
          key: data.key,
          password: data.password
        },
        keyType: data.type
      }
    });
  };

  const handleAuthorizationKeyDelete = async (
    keyType: AuthorizationKeyType
  ) => {
    authorizationKeyDelete({
      variables: { keyType }
    });
  };

  const handleShopSettingsUpdate = async (data: SiteSettingsPageFormData) => {
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
    const result = await shopSettingsUpdate({
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

  const errors = [
    ...(shopSettingsUpdateOpts.data?.shopDomainUpdate.errors || []),
    ...(shopSettingsUpdateOpts.data?.shopSettingsUpdate.errors || []),
    ...(shopSettingsUpdateOpts.data?.shopAddressUpdate.errors || [])
  ];
  const loading =
    siteSettingsQueryLoading ||
    authorizationKeyAddOpts.loading ||
    shopSettingsUpdateOpts.loading;

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.siteSettings)} />
      <SiteSettingsPage
        disabled={loading}
        errors={errors}
        shop={siteSettingsQueryData?.shop}
        onBack={() => navigate(configurationMenuUrl)}
        onKeyAdd={() =>
          navigate(
            siteSettingsUrl({
              action: "add-key"
            })
          )
        }
        onKeyRemove={handleAuthorizationKeyDelete}
        onSubmit={handleShopSettingsUpdate}
        saveButtonBarState={shopSettingsUpdateOpts.status}
      />
      <SiteSettingsKeyDialog
        errors={authorizationKeyAddOpts.data?.authorizationKeyAdd.errors || []}
        initial={{
          key: "",
          password: "",
          type: AuthorizationKeyType.FACEBOOK
        }}
        open={params.action === "add-key"}
        onClose={() => navigate(siteSettingsUrl())}
        onSubmit={handleAuthorizationKeyAdd}
      />
    </>
  );
};
export default SiteSettings;
