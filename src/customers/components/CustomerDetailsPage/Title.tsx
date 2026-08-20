import { ClickableCustomerType } from "@dashboard/components/CustomerType/CustomerType";
import { Pill } from "@dashboard/components/Pill";
import { getUserName } from "@dashboard/misc";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

interface CustomerDetailsHeaderCustomer {
  email: string;
  firstName?: string;
  lastName?: string;
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

export const CustomerDetailsTitle = ({ customer, loading }: CustomerDetailsTitleProps) => {
  const classes = useStyles();
  const intl = useIntl();
  const isHeaderLoading = loading && !customer;

  if (isHeaderLoading) {
    return (
      <div className={classes.container}>
        <Skeleton __width="12em" data-test-id="customer-details-title-skeleton" />
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
        <ClickableCustomerType
          customerType={{
            id: customer.customerType.id,
            name: customer.customerType.name,
            slug: customer.customerType.slug,
          }}
          size={3}
        />
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
