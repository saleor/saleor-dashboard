// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Pill } from "@dashboard/components/Pill";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
import { customerAddressesUrl, customerListPath } from "@dashboard/customers/urls";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForCustomerDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { CustomerGiftCardsCard } from "@dashboard/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard";
import {
  type AccountErrorFragment,
  type CustomerDetailsQuery,
  PermissionEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { orderListUrlWithCustomerEmail } from "@dashboard/orders/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Button, Divider, Text } from "@saleor/macaw-ui-next";
import { Code } from "lucide-react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

import { getUserName } from "../../../misc";
import { AccountStatusCard } from "../AccountStatusCard/AccountStatusCard";
import CustomerAddresses from "../CustomerAddresses";
import CustomerInfo from "../CustomerInfo";
import CustomerOrders from "../CustomerOrders";
import { CustomerOverview } from "../CustomerOverview/CustomerOverview";
import { ExternalReferenceCard } from "../ExternalReferenceCard/ExternalReferenceCard";

export interface CustomerDetailsPageFormData {
  firstName: string;
  lastName: string;
  email: string;
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
  onActivateToggle: () => void;
  onShowMetadata: () => void;
}

const CustomerDetailsPage = ({
  customerId,
  customer,
  disabled,
  errors,
  saveButtonBar,
  onSubmit,
  onDelete,
  onActivateToggle,
  onShowMetadata,
}: CustomerDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const initialForm: CustomerDetailsPageFormData = {
    email: customer?.email || "",
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    note: customer?.note || "",
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

  // Account-level actions live in the cogs "More actions" menu so destructive
  // toggles (activate / deactivate) and Delete are not bundled with the form
  // save. Delete is also kept in the savebar for discoverability.
  const builtInMenuItems = customer
    ? [
        {
          label: customer.isActive
            ? intl.formatMessage({
                defaultMessage: "Deactivate user",
                description: "customer detail cogs menu, deactivates the customer account",
                id: "zP3Rb6",
              })
            : intl.formatMessage({
                defaultMessage: "Activate user",
                description: "customer detail cogs menu, activates a deactivated customer account",
                id: "62Rs/K",
              }),
          onSelect: onActivateToggle,
          testId: customer.isActive ? "deactivate-user" : "activate-user",
        },
        {
          label: intl.formatMessage({
            defaultMessage: "Delete user",
            description: "customer detail cogs menu, opens the delete-confirmation dialog",
            id: "LQg8/p",
          }),
          onSelect: onDelete,
          testId: "delete-user",
          color: "critical1" as const,
        },
      ]
    : [];
  const menuItems = [...builtInMenuItems, ...extensionMenuItems];

  const customerName = getUserName(customer, true);
  // Mirrors OrderDetailsPage's title layout: name (+ optional Staff pill) on
  // the left, "Member since" date as a lower-emphasis sibling on the right,
  // both on the same line. Keeps the page's TopNav consistent with Orders.
  const titleNode = (
    <Box display="flex" alignItems="center" gap={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <span>{customerName}</span>
        {customer?.isStaff && customerName && (
          <Pill
            color="info"
            label={intl.formatMessage({
              defaultMessage: "Staff",
              description: "badge next to customer name marking this user as staff",
              id: "Jk8bsM",
            })}
            data-test-id="customer-staff-badge"
          />
        )}
      </Box>
      {customer?.dateJoined && (
        <Text size={3} fontWeight="regular" color="default2">
          <FormattedMessage
            defaultMessage="Member since {date}"
            description="customer detail page header, when this customer's account was created"
            id="8FgYfb"
            values={{
              date: <FormattedDate value={customer.dateJoined} month="short" year="numeric" />,
            }}
          />
        </Text>
      )}
    </Box>
  );

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => {
        return (
          <DetailPageLayout>
            <TopNav href={customerBackLink} title={titleNode}>
              <Button
                variant="secondary"
                icon={<Code size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
                onClick={onShowMetadata}
                disabled={!customer}
                data-test-id="show-customer-metadata"
                title={intl.formatMessage({
                  defaultMessage: "Edit customer metadata",
                  description: "customer detail page, top-bar metadata button tooltip",
                  id: "DR3EBs",
                })}
              />
              {menuItems.length > 0 && <TopNav.Menu items={menuItems} dataTestId="menu" />}
            </TopNav>
            <DetailPageLayout.Content paddingBottom={10}>
              <Backlink href={customerBackLink}>
                {intl.formatMessage(sectionNames.customers)}
              </Backlink>
              <CustomerOverview customer={customer} />
              <CardSpacer />
              <CustomerInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              <CardSpacer />
              <CustomerAddresses
                customer={customer}
                disabled={disabled}
                manageAddressHref={customerAddressesUrl(customerId)}
              />
              <CardSpacer />
              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                <CustomerOrders
                  orders={mapEdgesToItems(customer?.orders)}
                  viewAllHref={orderListUrlWithCustomerEmail(customer?.email)}
                />
              </RequirePermissions>
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <AccountStatusCard customer={customer} />
              <CardSpacer />
              <ExternalReferenceCard customer={customer} />
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
