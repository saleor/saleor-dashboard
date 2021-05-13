import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { mapEdgesToItems, mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import { getUserName } from "../../../misc";
import { CustomerDetails_user } from "../../types/CustomerDetails";
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
  customer: CustomerDetails_user;
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: CustomerDetailsPageFormData) => SubmitPromise;
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
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
      {({ change, data, hasChanged, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.customers)}
            </AppHeader>
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
                <CustomerOrders
                  orders={mapEdgesToItems(customer?.orders)}
                  onViewAllOrdersClick={onViewAllOrdersClick}
                  onRowClick={onRowClick}
                />
                <CardSpacer />
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
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              state={saveButtonBar}
              onSave={submit}
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
