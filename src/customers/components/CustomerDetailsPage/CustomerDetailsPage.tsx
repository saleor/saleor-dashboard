// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { MetadataFormData } from "@dashboard/components/Metadata/types";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
import { customerAddressesUrl, customerListPath } from "@dashboard/customers/urls";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForCustomerDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import CustomerGiftCardsCard from "@dashboard/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard";
import { AccountErrorFragment, CustomerDetailsQuery, PermissionEnum } from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { orderListUrl } from "@dashboard/orders/urls";
import { mapEdgesToItems, mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Divider } from "@saleor/macaw-ui-next";
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

interface CustomerDetailsPageProps {
  customerId: string;
  customer: CustomerDetailsQuery["user"];
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onSubmit: (data: CustomerDetailsPageFormData) => SubmitPromise<AccountErrorFragment[]>;
  onDelete: () => void;
}

const CustomerDetailsPage = ({
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
    privateMetadata: customer?.privateMetadata
      ? customer?.privateMetadata.map(mapMetadataItemToInput)
      : [],
  };
  const { CUSTOMER_DETAILS_MORE_ACTIONS, CUSTOMER_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.CUSTOMER_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForCustomerDetails(
    CUSTOMER_DETAILS_MORE_ACTIONS,
    customerId,
  );

  const customerBackLink = useBackLinkWithState({
    path: customerListPath,
  });

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => {
        return (
          <DetailPageLayout>
            <TopNav href={customerBackLink} title={getUserName(customer, true)}>
              {extensionMenuItems.length > 0 && (
                <TopNav.Menu items={[...extensionMenuItems]} dataTestId="menu" />
              )}
            </TopNav>
            <DetailPageLayout.Content>
              <Backlink href={customerBackLink}>
                {intl.formatMessage(sectionNames.customers)}
              </Backlink>
              <CustomerDetails
                customer={customer}
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <CustomerInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              <CardSpacer />
              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                <CustomerOrders
                  orders={mapEdgesToItems(customer?.orders)}
                  viewAllHref={orderListUrl({
                    customer: customer?.email,
                  })}
                />
                <CardSpacer />
              </RequirePermissions>
              <Metadata data={data} onChange={change} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <CustomerAddresses
                customer={customer}
                disabled={disabled}
                manageAddressHref={customerAddressesUrl(customerId)}
              />
              <CardSpacer />
              <CustomerStats customer={customer} />
              <CardSpacer />
              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_GIFT_CARD]}>
                <CustomerGiftCardsCard />
              </RequirePermissions>
              {CUSTOMER_DETAILS_WIDGETS.length > 0 && customer?.id && (
                <>
                  <CardSpacer />
                  <Divider />
                  <AppWidgets
                    extensions={CUSTOMER_DETAILS_WIDGETS}
                    params={{ customerId: customer.id }}
                  />
                </>
              )}
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(customerBackLink)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBar}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

CustomerDetailsPage.displayName = "CustomerDetailsPage";
export default CustomerDetailsPage;
