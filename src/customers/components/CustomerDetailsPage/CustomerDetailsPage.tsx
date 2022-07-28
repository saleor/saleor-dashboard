import { Backlink } from "@saleor/components/Backlink";
import { CardSpacer } from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import RequirePermissions from "@saleor/components/RequirePermissions";
import Savebar from "@saleor/components/Savebar";
import { customerAddressesUrl, customerListUrl } from "@saleor/customers/urls";
import CustomerGiftCardsCard from "@saleor/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard";
import {
  AccountErrorFragment,
  CustomerDetailsQuery,
  PermissionEnum,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { orderListUrl } from "@saleor/orders/urls";
import { mapEdgesToItems, mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
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
            <PageHeader title={getUserName(customer, true)} />
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
