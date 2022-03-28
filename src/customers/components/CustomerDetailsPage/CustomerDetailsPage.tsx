import { CardSpacer } from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import RequirePermissions from "@saleor/components/RequirePermissions";
import Savebar from "@saleor/components/Savebar";
import CustomerGiftCardsCard from "@saleor/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard";
import {
  AccountErrorFragment,
  CustomerDetailsQuery,
  PermissionEnum
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
  customer: CustomerDetailsQuery["user"];
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (
    data: CustomerDetailsPageFormData
  ) => SubmitPromise<AccountErrorFragment[]>;
  onViewAllOrdersClick: () => void;
  onRowClick: (id: string) => void;
  onAddressManageClick: () => void;
  onDelete: () => void;
}

const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({
  customer,
  disabled,
  errors,
  saveButtonBar,
  onBack,
  onSubmit,
  onViewAllOrdersClick,
  onRowClick,
  onAddressManageClick,
  onDelete
}: CustomerDetailsPageProps) => {
  const intl = useIntl();

  const initialForm: CustomerDetailsPageFormData = {
    email: customer?.email || "",
    firstName: customer?.firstName || "",
    isActive: customer?.isActive || false,
    lastName: customer?.lastName || "",
    metadata: customer?.metadata.map(mapMetadataItemToInput),
    note: customer?.note || "",
    privateMetadata: customer?.privateMetadata.map(mapMetadataItemToInput)
  };

  const {
    makeChangeHandler: makeMetadataChangeHandler
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
            <Backlink onClick={onBack}>
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
                    onViewAllOrdersClick={onViewAllOrdersClick}
                    onRowClick={onRowClick}
                  />
                  <CardSpacer />
                </RequirePermissions>
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <CustomerAddresses
                  customer={customer}
                  disabled={disabled}
                  onAddressManageClick={onAddressManageClick}
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
              onCancel={onBack}
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
