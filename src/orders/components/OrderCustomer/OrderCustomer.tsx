// @ts-strict-ignore
import AddressFormatter from "@dashboard/components/AddressFormatter";
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { AddressType } from "@dashboard/customers/types";
import { customerUrl } from "@dashboard/customers/urls";
import {
  OrderDetailsFragment,
  OrderErrorCode,
  OrderErrorFragment,
  PermissionEnum,
  SearchCustomersQuery,
} from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { orderListUrlWithCustomerEmail, orderListUrlWithCustomerId } from "@dashboard/orders/urls";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Box, Button, Skeleton, sprinkles, Text } from "@saleor/macaw-ui-next";
import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { AddressTextError } from "./AddressTextError";
import { CustomerEditForm } from "./CustomerEditForm";
import { PickupAnnotation } from "./PickupAnnotation";

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

const formatAddressForClipboard = (address: AddressType): string => {
  const lines = [
    [address.firstName, address.lastName].filter(Boolean).join(" "),
    address.companyName,
    address.streetAddress1,
    address.streetAddress2,
    [address.postalCode, address.city].filter(Boolean).join(" "),
    address.countryArea,
    address.country?.country,
    address.phone,
  ].filter(Boolean);

  return lines.join("\n");
};

interface CopyButtonProps {
  show: boolean;
  copied: boolean;
  onClick: () => void;
  className: string;
  ariaLabel: string;
}

const CopyButton = ({ show, copied, onClick, className, ariaLabel }: CopyButtonProps) => (
  <Box
    position="absolute"
    __right={0}
    __bottom={0}
    style={{
      opacity: show ? 1 : 0,
      transition: "opacity 0.15s ease-in-out",
    }}
    pointerEvents={show ? "auto" : "none"}
  >
    <Button
      variant="tertiary"
      size="small"
      icon={
        copied ? (
          <CheckIcon size={14} className={className} />
        ) : (
          <CopyIcon size={14} className={className} />
        )
      }
      onClick={onClick}
      aria-label={ariaLabel}
    />
  </Box>
);

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

  const [copiedEmail, copyEmail] = useClipboard();
  const [copiedShipping, copyShipping] = useClipboard();
  const [copiedBilling, copyBilling] = useClipboard();

  const [showEmailCopy, setShowEmailCopy] = React.useState(false);
  const [showShippingCopy, setShowShippingCopy] = React.useState(false);
  const [showBillingCopy, setShowBillingCopy] = React.useState(false);

  const iconClassName = sprinkles({ color: "default2" });
  const customerEmail = user?.email || order?.userEmail;

  const copyAriaLabel = intl.formatMessage({
    defaultMessage: "Copy to clipboard",
    id: "aCdAsI",
  });

  if (isInEditMode) {
    return (
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title size={6} fontWeight="medium">
            <FormattedMessage
              id="+ahkGr"
              defaultMessage="Customer details"
              description="section header"
            />
          </DashboardCard.Title>
          <DashboardCard.Toolbar>
            <Button
              data-test-id="edit-customer"
              variant="secondary"
              disabled={!onCustomerEdit}
              onClick={toggleEditMode}
            >
              <FormattedMessage {...buttonMessages.edit} />
            </Button>
          </DashboardCard.Toolbar>
        </DashboardCard.Header>
        <DashboardCard.Content>
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
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title size={6} fontWeight="medium">
          <FormattedMessage
            id="+ahkGr"
            defaultMessage="Customer details"
            description="section header"
          />
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          {!!canEditCustomer && (
            <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
              <Button
                variant="secondary"
                disabled={!onCustomerEdit}
                onClick={toggleEditMode}
                data-test-id="edit-customer"
              >
                <FormattedMessage {...buttonMessages.edit} />
              </Button>
            </RequirePermissions>
          )}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>

      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Customer */}
          <Box data-test-id="customer-email-section">
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
              <Text color="default2" size={4}>
                <FormattedMessage id="hkENym" defaultMessage="Customer" />
              </Text>
              <Box display="flex" gap={3} alignItems="center">
                {(user || order?.userEmail) && (
                  <Link
                    underline={false}
                    href={
                      user
                        ? orderListUrlWithCustomerId(user.id)
                        : orderListUrlWithCustomerEmail(order?.userEmail!)
                    }
                  >
                    <FormattedMessage id="cFA9vl" defaultMessage="View orders" description="link" />
                  </Link>
                )}
                {user && (
                  <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_USERS]}>
                    <Link underline={false} href={customerUrl(user.id)} onClick={onProfileView}>
                      <FormattedMessage
                        id="7A+FJl"
                        defaultMessage="View profile"
                        description="link"
                      />
                    </Link>
                  </RequirePermissions>
                )}
              </Box>
            </Box>
            {user === undefined ? (
              <Skeleton />
            ) : !user && !order?.userEmail ? (
              <Text>
                <FormattedMessage
                  id="Z7YrIb"
                  defaultMessage="Not set"
                  description="no customer assigned to order"
                />
              </Text>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                onMouseEnter={() => setShowEmailCopy(true)}
                onMouseLeave={() => setShowEmailCopy(false)}
              >
                <Text size={4} fontWeight="medium">
                  {customerEmail}
                </Text>
                <Box
                  style={{
                    opacity: showEmailCopy ? 1 : 0,
                    transition: "opacity 0.15s ease-in-out",
                  }}
                  pointerEvents={showEmailCopy ? "auto" : "none"}
                >
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={
                      copiedEmail ? (
                        <CheckIcon size={14} className={iconClassName} />
                      ) : (
                        <CopyIcon size={14} className={iconClassName} />
                      )
                    }
                    onClick={() => copyEmail(customerEmail || "")}
                    aria-label={copyAriaLabel}
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* Shipping Address */}
          <Box data-test-id="shipping-address-section">
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
              <Text color="default2" size={4}>
                <FormattedMessage id="ZpVtCa" defaultMessage="Shipping address" />
              </Text>
              {canEditAddresses && (
                <Button
                  data-test-id="edit-shipping-address"
                  variant="secondary"
                  onClick={onShippingAddressEdit}
                  disabled={!onShippingAddressEdit && user === undefined}
                >
                  <FormattedMessage {...buttonMessages.edit} />
                </Button>
              )}
            </Box>
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
                  <Box
                    position="relative"
                    onMouseEnter={() => setShowShippingCopy(true)}
                    onMouseLeave={() => setShowShippingCopy(false)}
                  >
                    <AddressFormatter address={shippingAddress} fontSize={4} />
                    <PickupAnnotation order={order} />
                    <CopyButton
                      show={showShippingCopy}
                      copied={copiedShipping}
                      onClick={() => copyShipping(formatAddressForClipboard(shippingAddress))}
                      className={iconClassName}
                      ariaLabel={copyAriaLabel}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Billing Address */}
          <Box data-test-id="billing-address-section">
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
              <Text color="default2" size={4}>
                <FormattedMessage id="6orx1c" defaultMessage="Billing address" />
              </Text>
              {canEditAddresses && (
                <Button
                  data-test-id="edit-billing-address"
                  variant="secondary"
                  onClick={onBillingAddressEdit}
                  disabled={!onBillingAddressEdit && user === undefined}
                >
                  <FormattedMessage {...buttonMessages.edit} />
                </Button>
              )}
            </Box>
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
                  <Box
                    position="relative"
                    onMouseEnter={() => setShowBillingCopy(true)}
                    onMouseLeave={() => setShowBillingCopy(false)}
                  >
                    <AddressFormatter address={billingAddress} fontSize={4} />
                    <CopyButton
                      show={showBillingCopy}
                      copied={copiedBilling}
                      onClick={() => copyBilling(formatAddressForClipboard(billingAddress))}
                      className={iconClassName}
                      ariaLabel={copyAriaLabel}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderCustomer.displayName = "OrderCustomer";
export default OrderCustomer;
