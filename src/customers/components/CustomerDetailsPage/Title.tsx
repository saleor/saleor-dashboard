import { ClickableCustomerType } from "@dashboard/components/CustomerType/CustomerType";
import { Pill } from "@dashboard/components/Pill/Pill";
import { rippleCustomerTypes } from "@dashboard/customerTypes/ripples/customerTypes";
import { getUserName } from "@dashboard/misc";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

interface CustomerDetailsHeaderCustomer {
  email: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isConfirmed?: boolean;
  isStaff?: boolean;
  dateJoined?: string;
  customerType?: {
    id?: string;
    name?: string;
    slug?: string;
  } | null;
}

interface CustomerDetailsTitleProps {
  customer?: CustomerDetailsHeaderCustomer | null;
  loading?: boolean;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      gap: theme.spacing(2),
    },
    name: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  }),
  { name: "CustomerDetailsTitle" },
);

export const CustomerDetailsTitle = ({
  customer,
  loading,
}: CustomerDetailsTitleProps): JSX.Element | null => {
  const classes = useStyles();
  const intl = useIntl();
  const isHeaderLoading = loading && !customer;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="customer-details-title-skeleton" />
        <Skeleton __width="4rem" data-test-id="customer-details-status-skeleton" />
        <Skeleton __width="6rem" data-test-id="customer-details-customer-type-skeleton" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const customerName = getUserName(customer, true);

  return (
    <div className={classes.container}>
      <Box className={classes.name} title={customerName}>
        {customerName}
      </Box>
      {typeof customer.isActive === "boolean" &&
        (customer.isActive ? (
          <Pill
            color="success"
            label={intl.formatMessage({
              defaultMessage: "Active",
              description: "customer account is active",
              id: "8p8zxN",
            })}
            data-test-id="account-status-active"
          />
        ) : (
          <Pill
            color="neutral"
            label={intl.formatMessage({
              defaultMessage: "Inactive",
              description: "customer account is inactive (deactivated)",
              id: "3DDUnc",
            })}
            data-test-id="account-status-inactive"
          />
        ))}
      {customer.isConfirmed === false && (
        <Pill
          color="warning"
          label={intl.formatMessage({
            defaultMessage: "Unverified",
            description: "customer email verification status",
            id: "D+Nw8P",
          })}
          data-test-id="account-status-email-unverified"
        />
      )}
      {customer.isStaff && customerName && (
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
      {customer.customerType?.name && (
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          __height="30px"
          paddingRight={5}
        >
          <ClickableCustomerType
            customerType={{
              id: customer.customerType.id,
              name: customer.customerType.name,
              slug: customer.customerType.slug,
            }}
            size={3}
          />
          <Box
            position="absolute"
            __top="0"
            __right="0"
            __width="30px"
            __height="30px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Ripple model={rippleCustomerTypes} />
          </Box>
        </Box>
      )}
      {customer.dateJoined && (
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
    </div>
  );
};
