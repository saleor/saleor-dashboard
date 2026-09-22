// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { type AccountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { makeStyles } from "@saleor/macaw-ui";
import { Input } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useIntl } from "react-intl";

import { type CustomerCreatePageFormData } from "../CustomerCreatePage/CustomerCreatePage";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(3),
      gridTemplateColumns: "1fr 1fr",
    },
  }),
  { name: "CustomerCreateDetails" },
);

interface CustomerCreateDetailsProps {
  data: CustomerCreatePageFormData;
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerCreateDetails = (props: CustomerCreateDetailsProps) => {
  const { data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["customerFirstName", "customerLastName", "email"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "fjPWOA",
            defaultMessage: "Customer Overview",
            description: "header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <div className={classes.root}>
          <Input
            data-test-id="customer-first-name"
            disabled={disabled}
            error={!!formErrors.customerFirstName}
            aria-invalid={!!formErrors.customerFirstName}
            name="customerFirstName"
            label={intl.formatMessage(commonMessages.firstName)}
            helperText={getAccountErrorMessage(formErrors.customerFirstName, intl)}
            type="text"
            value={data.customerFirstName}
            onChange={onChange}
            spellCheck={false}
          />
          <Input
            data-test-id="customer-last-name"
            disabled={disabled}
            error={!!formErrors.customerLastName}
            aria-invalid={!!formErrors.customerLastName}
            name="customerLastName"
            label={intl.formatMessage(commonMessages.lastName)}
            helperText={getAccountErrorMessage(formErrors.customerLastName, intl)}
            type="text"
            value={data.customerLastName}
            onChange={onChange}
            spellCheck={false}
          />
          <Input
            data-test-id="customer-email"
            disabled={disabled}
            error={!!formErrors.email}
            aria-invalid={!!formErrors.email}
            name="email"
            label={intl.formatMessage(commonMessages.email)}
            helperText={getAccountErrorMessage(formErrors.email, intl)}
            type="email"
            value={data.email}
            onChange={onChange}
            spellCheck={false}
          />
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerCreateDetails.displayName = "CustomerCreateDetails";
export default CustomerCreateDetails;
