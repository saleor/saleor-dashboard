// @ts-strict-ignore
import AddressFormatter from "@dashboard/components/AddressFormatter";
import { DashboardCard } from "@dashboard/components/Card";
import ExternalLink from "@dashboard/components/ExternalLink";
import Hr from "@dashboard/components/Hr";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import {
  OrderDetailsFragment,
  OrderErrorCode,
  OrderErrorFragment,
  PermissionEnum,
  SearchCustomersQuery,
} from "@dashboard/graphql";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { AddressTextError } from "./AddrssTextError";
import { CustomerEditForm } from "./CustomerEditForm";
import { CustomerSection } from "./CustomerSection";
import { PickupAnnotation } from "./PickupAnnotation";
import { useStyles } from "./styles";

export interface CustomerEditData {
  user?: string;
  userEmail?: string;
  prevUser?: string;
  prevUserEmail?: string;
}

interface OrderCustomerProps extends Partial<FetchMoreProps> {
  order: OrderDetailsFragment;
  users?: RelayToFlat<SearchCustomersQuery["search"]>;
  loading?: boolean;
  errors: OrderErrorFragment[];
  canEditAddresses: boolean;
  canEditCustomer: boolean;
  fetchUsers?: (query: string) => void;
  onCustomerEdit?: (data: CustomerEditData) => void;
  onProfileView: () => void;
  onBillingAddressEdit?: () => void;
  onShippingAddressEdit?: () => void;
}

const OrderCustomer = (props: OrderCustomerProps) => {
  const {
    canEditAddresses,
    canEditCustomer,
    fetchUsers,
    hasMore: hasMoreUsers,
    loading,
    errors = [],
    order,
    users,
    onCustomerEdit,
    onBillingAddressEdit,
    onFetchMore: onFetchMoreUsers,
    onProfileView,
    onShippingAddressEdit,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const user = maybe(() => order.user);
  const [userDisplayName, setUserDisplayName] = useStateFromProps(maybe(() => user?.email, ""));
  const [isInEditMode, setEditModeStatus] = React.useState(false);
  const toggleEditMode = () => setEditModeStatus(!isInEditMode);
  const billingAddress = maybe(() => order.billingAddress);
  const shippingAddress = maybe(() => order.shippingAddress);
  const noBillingAddressError = errors.find(
    error => error.code === OrderErrorCode.BILLING_ADDRESS_NOT_SET,
  );
  const noShippingAddressError = errors.find(
    error => error.code === OrderErrorCode.ORDER_NO_SHIPPING_ADDRESS,
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "Y7M1YQ",
            defaultMessage: "Customer",
            description: "section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          {!!canEditCustomer && (
            <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
              <Button
                data-test-id="edit-customer"
                variant="secondary"
                disabled={!onCustomerEdit}
                onClick={toggleEditMode}
              >
                {intl.formatMessage(buttonMessages.edit)}
              </Button>
            </RequirePermissions>
          )}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {isInEditMode ? (
          <CustomerEditForm
            currentUser={user}
            currentUserEmail={order?.userEmail}
            allUsers={users}
            fetchUsers={fetchUsers}
            onCustomerEdit={onCustomerEdit}
            onFetchMore={onFetchMoreUsers}
            hasMore={hasMoreUsers}
            loading={loading}
            toggleEditMode={toggleEditMode}
            setUserDisplayName={setUserDisplayName}
            userDisplayName={userDisplayName}
          />
        ) : (
          <CustomerSection
            user={user}
            userEmail={order?.userEmail}
            onProfileView={onProfileView}
            userEmailClassName={classes.userEmail}
          />
        )}
      </DashboardCard.Content>
      {!!user && (
        <>
          <Hr />
          <DashboardCard.Content>
            <div className={classes.sectionHeader}>
              <Text className={classes.sectionHeaderTitle}>
                <FormattedMessage
                  id="4Jp83O"
                  defaultMessage="Contact Information"
                  description="subheader"
                />
              </Text>
            </div>

            {maybe(() => order.userEmail) === undefined ? (
              <Skeleton />
            ) : order.userEmail === null ? (
              <Text>
                <FormattedMessage
                  id="PX2zWy"
                  defaultMessage="Not set"
                  description="customer is not set in draft order"
                />
              </Text>
            ) : (
              <ExternalLink href={`mailto:${maybe(() => order.userEmail)}`}>
                {maybe(() => order.userEmail)}
              </ExternalLink>
            )}
          </DashboardCard.Content>
        </>
      )}
      <Hr />
      <DashboardCard.Content data-test-id="shipping-address-section">
        <div className={classes.sectionHeader}>
          <Text className={classes.sectionHeaderTitle}>
            <FormattedMessage id="DP5VOH" defaultMessage="Shipping Address" />
          </Text>
          {canEditAddresses && (
            <div>
              <Button
                data-test-id="edit-shipping-address"
                variant="secondary"
                onClick={onShippingAddressEdit}
                disabled={!onShippingAddressEdit && user === undefined}
              >
                <FormattedMessage {...buttonMessages.edit} />
              </Button>
            </div>
          )}
        </div>
        {shippingAddress === undefined ? (
          <Skeleton />
        ) : (
          <>
            {noShippingAddressError && <AddressTextError orderError={noShippingAddressError} />}
            {shippingAddress === null ? (
              <Text>
                <FormattedMessage
                  id="e7yOai"
                  defaultMessage="Not set"
                  description="shipping address is not set in draft order"
                />
              </Text>
            ) : (
              <>
                <AddressFormatter address={shippingAddress} />
                <PickupAnnotation order={order} />
              </>
            )}
          </>
        )}
      </DashboardCard.Content>
      <Hr />
      <DashboardCard.Content data-test-id="billing-address-section">
        <div className={classes.sectionHeader}>
          <Text className={classes.sectionHeaderTitle}>
            <FormattedMessage id="c7/79+" defaultMessage="Billing Address" />
          </Text>
          {canEditAddresses && (
            <div>
              <Button
                data-test-id="edit-billing-address"
                variant="secondary"
                onClick={onBillingAddressEdit}
                disabled={!onBillingAddressEdit && user === undefined}
              >
                <FormattedMessage {...buttonMessages.edit} />
              </Button>
            </div>
          )}
        </div>
        {billingAddress === undefined ? (
          <Skeleton />
        ) : (
          <>
            {noBillingAddressError && <AddressTextError orderError={noBillingAddressError} />}
            {billingAddress === null ? (
              <Text>
                <FormattedMessage
                  id="YI6Fhj"
                  defaultMessage="Not set"
                  description="no address is set in draft order"
                />
              </Text>
            ) : maybe(() => shippingAddress.id) === billingAddress.id ? (
              <Text>
                <FormattedMessage
                  id="GLX9II"
                  defaultMessage="Same as shipping address"
                  description="billing address"
                />
              </Text>
            ) : (
              <AddressFormatter address={billingAddress} />
            )}
          </>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderCustomer.displayName = "OrderCustomer";
export default OrderCustomer;
