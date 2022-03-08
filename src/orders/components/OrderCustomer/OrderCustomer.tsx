import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ExternalLink from "@saleor/components/ExternalLink";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import Link from "@saleor/components/Link";
import RequirePermissions from "@saleor/components/RequirePermissions";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import {
  OrderDetailsFragment,
  PermissionEnum,
  SearchCustomersQuery,
  WarehouseClickAndCollectOptionEnum
} from "@saleor/graphql";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { Button, makeStyles } from "@saleor/macaw-ui";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { customerUrl } from "../../../customers/urls";
import { maybe } from "../../../misc";
import messages from "./messages";

const useStyles = makeStyles(
  theme => ({
    sectionHeader: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3)
    },
    sectionHeaderTitle: {
      flex: 1,
      fontWeight: 600 as 600,
      lineHeight: 1,
      textTransform: "uppercase"
    },
    sectionHeaderToolbar: {
      marginRight: theme.spacing(-2)
    },
    userEmail: {
      fontWeight: 600 as 600,
      marginBottom: theme.spacing(1)
    }
  }),
  { name: "OrderCustomer" }
);

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
  canEditAddresses: boolean;
  canEditCustomer: boolean;
  fetchUsers?: (query: string) => void;
  onCustomerEdit?: (data: CustomerEditData) => void;
  onProfileView: () => void;
  onBillingAddressEdit?: () => void;
  onShippingAddressEdit?: () => void;
}

const OrderCustomer: React.FC<OrderCustomerProps> = props => {
  const {
    canEditAddresses,
    canEditCustomer,
    fetchUsers,
    hasMore: hasMoreUsers,
    loading,
    order,
    users,
    onCustomerEdit,
    onBillingAddressEdit,
    onFetchMore: onFetchMoreUsers,
    onProfileView,
    onShippingAddressEdit
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const user = maybe(() => order.user);
  const userEmail = maybe(() => order.userEmail);

  const [userDisplayName, setUserDisplayName] = useStateFromProps(
    maybe(() => user.email, "")
  );
  const [isInEditMode, setEditModeStatus] = React.useState(false);
  const toggleEditMode = () => setEditModeStatus(!isInEditMode);

  const billingAddress = maybe(() => order.billingAddress);
  const shippingAddress = maybe(() => order.shippingAddress);

  const pickupAnnotation = order => {
    if (order?.deliveryMethod?.__typename === "Warehouse") {
      return (
        <>
          <FormSpacer />
          <Typography variant="caption" color="textSecondary">
            {order?.deliveryMethod?.clickAndCollectOption ===
            WarehouseClickAndCollectOptionEnum.LOCAL ? (
              <FormattedMessage {...messages.orderCustomerFulfillmentLocal} />
            ) : (
              <FormattedMessage {...messages.orderCustomerFulfillmentAll} />
            )}
          </Typography>
        </>
      );
    }
    return "";
  };

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Customer",
          description: "section header"
        })}
        toolbar={
          !!canEditCustomer && (
            <RequirePermissions
              requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
            >
              <Button
                data-test-id="edit-customer"
                variant="tertiary"
                disabled={!onCustomerEdit}
                onClick={toggleEditMode}
              >
                {intl.formatMessage(buttonMessages.edit)}
              </Button>
            </RequirePermissions>
          )
        }
      />
      <CardContent>
        {user === undefined ? (
          <Skeleton />
        ) : isInEditMode && canEditCustomer ? (
          <Form confirmLeave initial={{ query: "" }}>
            {({ change, data }) => {
              const handleChange = (event: React.ChangeEvent<any>) => {
                change(event);
                const value = event.target.value;

                onCustomerEdit({
                  prevUser: user?.id,
                  prevUserEmail: userEmail,
                  [value.includes("@") ? "userEmail" : "user"]: value
                });
                toggleEditMode();
              };
              const userChoices = maybe(() => users, []).map(user => ({
                label: user.email,
                value: user.id
              }));
              const handleUserChange = createSingleAutocompleteSelectHandler(
                handleChange,
                setUserDisplayName,
                userChoices
              );
              return (
                <SingleAutocompleteSelectField
                  data-test-id="select-customer"
                  allowCustomValues={true}
                  choices={userChoices}
                  displayValue={userDisplayName}
                  fetchChoices={fetchUsers}
                  hasMore={hasMoreUsers}
                  loading={loading}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Search Customers"
                  })}
                  onChange={handleUserChange}
                  onFetchMore={onFetchMoreUsers}
                  name="query"
                  value={data.query}
                />
              );
            }}
          </Form>
        ) : user === null ? (
          userEmail === null ? (
            <Typography>
              <FormattedMessage defaultMessage="Anonymous user" />
            </Typography>
          ) : (
            <Typography className={classes.userEmail}>{userEmail}</Typography>
          )
        ) : (
          <>
            <Typography
              className={classes.userEmail}
              data-test-id="customer-email"
            >
              {user.email}
            </Typography>
            <RequirePermissions
              requiredPermissions={[PermissionEnum.MANAGE_USERS]}
            >
              <div>
                <Link
                  underline={false}
                  href={customerUrl(user.id)}
                  onClick={onProfileView}
                >
                  <FormattedMessage
                    defaultMessage="View Profile"
                    description="link"
                  />
                </Link>
              </div>
            </RequirePermissions>
            {/* TODO: Uncomment it after adding ability to filter
                    orders by customer */}
            {/* <div>
                <Link underline={false} href={}>
                  <FormattedMessage defaultMessage="View Orders"
                    description="link"
                     />
                </Link>
              </div> */}
          </>
        )}
      </CardContent>
      {!!user && (
        <>
          <Hr />
          <CardContent>
            <div className={classes.sectionHeader}>
              <Typography className={classes.sectionHeaderTitle}>
                <FormattedMessage
                  defaultMessage="Contact Information"
                  description="subheader"
                />
              </Typography>
            </div>

            {maybe(() => order.userEmail) === undefined ? (
              <Skeleton />
            ) : order.userEmail === null ? (
              <Typography>
                <FormattedMessage
                  defaultMessage="Not set"
                  description="customer is not set in draft order"
                  id="orderCustomerCustomerNotSet"
                />
              </Typography>
            ) : (
              <ExternalLink
                href={`mailto:${maybe(() => order.userEmail)}`}
                typographyProps={{ color: "primary" }}
              >
                {maybe(() => order.userEmail)}
              </ExternalLink>
            )}
          </CardContent>
        </>
      )}
      <Hr />
      <CardContent>
        <div className={classes.sectionHeader}>
          <Typography className={classes.sectionHeaderTitle}>
            <FormattedMessage defaultMessage="Shipping Address" />
          </Typography>
          {canEditAddresses && (
            <div className={classes.sectionHeaderToolbar}>
              <Button
                data-test-id="edit-shipping-address"
                variant="tertiary"
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
        ) : shippingAddress === null ? (
          <Typography>
            <FormattedMessage
              defaultMessage="Not set"
              description="shipping address is not set in draft order"
              id="orderCustomerShippingAddressNotSet"
            />
          </Typography>
        ) : (
          <>
            {shippingAddress.companyName && (
              <Typography>{shippingAddress.companyName}</Typography>
            )}
            <Typography>
              {shippingAddress.firstName} {shippingAddress.lastName}
            </Typography>
            <Typography>
              {shippingAddress.streetAddress1}
              <br />
              {shippingAddress.streetAddress2}
            </Typography>
            <Typography>
              {shippingAddress.postalCode} {shippingAddress.city}
              {shippingAddress.cityArea ? ", " + shippingAddress.cityArea : ""}
            </Typography>
            <Typography>
              {shippingAddress.countryArea
                ? shippingAddress.countryArea +
                  ", " +
                  shippingAddress.country.country
                : shippingAddress.country.country}
            </Typography>
            <Typography>{shippingAddress.phone}</Typography>
            {pickupAnnotation(order)}
          </>
        )}
      </CardContent>
      <Hr />
      <CardContent>
        <div className={classes.sectionHeader}>
          <Typography className={classes.sectionHeaderTitle}>
            <FormattedMessage defaultMessage="Billing Address" />
          </Typography>
          {canEditAddresses && (
            <div className={classes.sectionHeaderToolbar}>
              <Button
                data-test-id="edit-billing-address"
                variant="tertiary"
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
        ) : billingAddress === null ? (
          <Typography>
            <FormattedMessage
              defaultMessage="Not set"
              description="no address is set in draft order"
              id="orderCustomerBillingAddressNotSet"
            />
          </Typography>
        ) : maybe(() => shippingAddress.id) === billingAddress.id ? (
          <Typography>
            <FormattedMessage
              defaultMessage="Same as shipping address"
              description="billing address"
            />
          </Typography>
        ) : (
          <>
            {billingAddress.companyName && (
              <Typography>{billingAddress.companyName}</Typography>
            )}
            <Typography>
              {billingAddress.firstName} {billingAddress.lastName}
            </Typography>
            <Typography>
              {billingAddress.streetAddress1}
              <br />
              {billingAddress.streetAddress2}
            </Typography>
            <Typography>
              {billingAddress.postalCode} {billingAddress.city}
              {billingAddress.cityArea ? ", " + billingAddress.cityArea : ""}
            </Typography>
            <Typography>
              {billingAddress.countryArea
                ? billingAddress.countryArea +
                  ", " +
                  billingAddress.country.country
                : billingAddress.country.country}
            </Typography>
            <Typography>{billingAddress.phone}</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

OrderCustomer.displayName = "OrderCustomer";
export default OrderCustomer;
