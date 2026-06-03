// @ts-strict-ignore
import AddressFormatter from "@dashboard/components/AddressFormatter";
import { DashboardCard } from "@dashboard/components/Card";
import ExternalLink from "@dashboard/components/ExternalLink";
import Hr from "@dashboard/components/Hr";
import Link from "@dashboard/components/Link";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import {
  OrderDetailsFragment,
  OrderErrorCode,
  OrderErrorFragment,
  PermissionEnum,
  SearchCustomersQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { orderListUrlWithCustomer } from "@dashboard/orders/urls";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Button, DynamicCombobox, Option, Skeleton, Text } from "@saleor/macaw-ui-next";
import React, { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { customerUrl } from "../../../customers/urls";
import { maybe } from "../../../misc";
import { AddressTextError } from "./AddrssTextError";
import { PickupAnnotation } from "./PickupAnnotation";
import { useStyles } from "./styles";

export interface CustomerEditData {
  user?: string;
  userEmail?: string;
  prevUser?: string;
  prevUserEmail?: string;
}

export interface OrderCustomerProps extends Partial<FetchMoreProps> {
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

interface OrderCustomerEditFormProps {
  users: RelayToFlat<SearchCustomersQuery["search"]> | undefined;
  loading: boolean | undefined;
  hasMoreUsers: boolean | undefined;
  fetchUsers: ((query: string) => void) | undefined;
  onFetchMoreUsers: (() => void) | undefined;
  onCustomerEdit: ((data: CustomerEditData) => void) | undefined;
  toggleEditMode: () => void;
  user: OrderDetailsFragment["user"] | undefined;
  userEmail: string | undefined;
  userDisplayName: string;
  setUserDisplayName: (value: string) => void;
}

const OrderCustomerEditForm: React.FC<OrderCustomerEditFormProps> = ({
  users,
  loading,
  hasMoreUsers,
  fetchUsers,
  onFetchMoreUsers,
  onCustomerEdit,
  toggleEditMode,
  user,
  userEmail,
  userDisplayName,
  setUserDisplayName,
}) => {
  const intl = useIntl();
  const mounted = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedFetch = useDebounce(fetchUsers, 500);

  const userChoices = maybe(() => users, []).map(u => ({
    label: u.email,
    value: u.id,
  }));

  // Build options with custom value support for email addresses
  const buildOptions = () => {
    const options = [...userChoices];
    const trimmedInput = inputValue.trim();

    if (trimmedInput && trimmedInput.includes("@")) {
      const hasExactMatch = options.some(
        opt => opt.label.toLowerCase() === trimmedInput.toLowerCase(),
      );

      if (!hasExactMatch) {
        options.unshift({ label: `Use email: ${trimmedInput}`, value: trimmedInput });
      }
    }

    return options;
  };

  const handleChange = (option: Option | null) => {
    if (!option?.value) {
      return;
    }

    const value = option.value;

    setUserDisplayName(option.label);

    onCustomerEdit?.({
      prevUser: user?.id,
      prevUserEmail: userEmail,
      [value.includes("@") ? "userEmail" : "user"]: value,
    });
    toggleEditMode();
  };

  return (
    <DynamicCombobox
      data-test-id="select-customer"
      label={intl.formatMessage({
        id: "hkSkNx",
        defaultMessage: "Search Customers",
      })}
      options={buildOptions()}
      onScrollEnd={() => {
        if (hasMoreUsers) {
          onFetchMoreUsers?.();
        }
      }}
      loading={loading || hasMoreUsers}
      onInputValueChange={value => {
        setInputValue(value);
        debouncedFetch?.(value);
      }}
      onFocus={() => {
        if (!mounted.current) {
          mounted.current = true;
          fetchUsers?.("");
        }
      }}
      name="query"
      value={
        userDisplayName
          ? {
              label: userDisplayName,
              value: userDisplayName,
            }
          : null
      }
      onChange={handleChange}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      size="small"
    />
  );
};

const OrderCustomer: React.FC<OrderCustomerProps> = props => {
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
  const userEmail = maybe(() => order.userEmail);
  const [userDisplayName, setUserDisplayName] = useStateFromProps(maybe(() => user.email, ""));
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
        {user === undefined ? (
          <Skeleton />
        ) : isInEditMode && canEditCustomer ? (
          <OrderCustomerEditForm
            users={users}
            loading={loading}
            hasMoreUsers={hasMoreUsers}
            fetchUsers={fetchUsers}
            onFetchMoreUsers={onFetchMoreUsers}
            onCustomerEdit={onCustomerEdit}
            toggleEditMode={toggleEditMode}
            user={user}
            userEmail={userEmail}
            userDisplayName={userDisplayName}
            setUserDisplayName={setUserDisplayName}
          />
        ) : user === null ? (
          userEmail === null ? (
            <Text>
              <FormattedMessage id="Qovenh" defaultMessage="Anonymous user" />
            </Text>
          ) : (
            <>
              <Text className={classes.userEmail}>{userEmail}</Text>
              <div>
                <Link underline={false} href={orderListUrlWithCustomer(userEmail)}>
                  <FormattedMessage id="J4NBVR" defaultMessage="View Orders" description="link" />
                </Link>
              </div>
            </>
          )
        ) : (
          <>
            <Text className={classes.userEmail} data-test-id="customer-email">
              {user.email}
            </Text>
            <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_USERS]}>
              <div>
                <Link underline={false} href={customerUrl(user.id)} onClick={onProfileView}>
                  <FormattedMessage id="VCzrEZ" defaultMessage="View Profile" description="link" />
                </Link>
              </div>
            </RequirePermissions>
            {/* TODO: Uncomment it after adding ability to filter
                    orders by customer */}
            {/* <div>
                <Link underline={false} href={}>
                  id="J4NBVR"
                  <FormattedMessage defaultMessage="View Orders"
                    description="link"
                     />
                </Link>
              </div> */}
          </>
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
