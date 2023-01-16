import {
  extensionMountPoints,
  mapToMenuItemsForCustomerDetails,
  useExtensions,
} from "@dashboard/apps/useExtensions";
import { Backlink } from "@dashboard/components/Backlink";
import CardMenu from "@dashboard/components/CardMenu/CardMenu";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import Container from "@dashboard/components/Container";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import Metadata from "@dashboard/components/Metadata/Metadata";
import { MetadataFormData } from "@dashboard/components/Metadata/types";
import PageHeader from "@dashboard/components/PageHeader";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import Savebar from "@dashboard/components/Savebar";
import {
  customerAddressesUrl,
  customerListUrl,
} from "@dashboard/customers/urls";
import CustomerGiftCardsCard from "@dashboard/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard";
import {
  AccountErrorFragment,
  CustomerDetailsQuery,
  PermissionEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { orderListUrl } from "@dashboard/orders/urls";
import { mapEdgesToItems, mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { getUserName } from "../../../misc";
import CustomerAddresses from "../CustomerAddresses";
import CustomerDetails from "../CustomerDetails";
import CustomerInfo from "../CustomerInfo";
import CustomerOrders from "../CustomerOrders";
import CustomerStats from "../CustomerStats";

export interface CustomerDetailsPageFormData extends MetadataFormData {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  note: string;
}

export interface CustomerDetailsPageProps {
  customerId: string;
  customer: CustomerDetailsQuery["user"];
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onSubmit: (
    data: CustomerDetailsPageFormData,
  ) => SubmitPromise<AccountErrorFragment[]>;
  onDelete: () => void;
}

const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({
  customerId,
  customer,
  disabled,
  errors,
  saveButtonBar,
  onSubmit,
  onDelete,
}: CustomerDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: CustomerDetailsPageFormData = {
    email: customer?.email || "",
    firstName: customer?.firstName || "",
    isActive: customer?.isActive || false,
    lastName: customer?.lastName || "",
    metadata: customer?.metadata.map(mapMetadataItemToInput),
    note: customer?.note || "",
    privateMetadata: customer?.privateMetadata.map(mapMetadataItemToInput),
  };

  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const { CUSTOMER_DETAILS_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.CUSTOMER_DETAILS,
  );

  const extensionMenuItems = mapToMenuItemsForCustomerDetails(
    CUSTOMER_DETAILS_MORE_ACTIONS,
    customerId,
  );

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ change, data, isSaveDisabled, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <Backlink href={customerListUrl()}>
              {intl.formatMessage(sectionNames.customers)}
            </Backlink>
            <PageHeader
              title={getUserName(customer, true)}
              cardMenu={
                extensionMenuItems.length > 0 && (
                  <CardMenu menuItems={extensionMenuItems} />
                )
              }
            />
            <Grid>
              <div>
                <CustomerDetails
                  customer={customer}
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CustomerInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <RequirePermissions
                  requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
                >
                  <CustomerOrders
                    orders={mapEdgesToItems(customer?.orders)}
                    viewAllHref={orderListUrl({
                      customer: customer?.email,
                    })}
                  />
                  <CardSpacer />
                </RequirePermissions>
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <CustomerAddresses
                  customer={customer}
                  disabled={disabled}
                  manageAddressHref={customerAddressesUrl(customerId)}
                />
                <CardSpacer />
                <CustomerStats customer={customer} />
                <CardSpacer />
                <RequirePermissions
                  requiredPermissions={[PermissionEnum.MANAGE_GIFT_CARD]}
                >
                  <CustomerGiftCardsCard />
                </RequirePermissions>
              </div>
            </Grid>
            <Savebar
              disabled={isSaveDisabled}
              state={saveButtonBar}
              onSubmit={submit}
              onCancel={() => navigate(customerListUrl())}
              onDelete={onDelete}
            />
          </Container>
        );
      }}
    </Form>
  );
};
CustomerDetailsPage.displayName = "CustomerDetailsPage";
export default CustomerDetailsPage;
