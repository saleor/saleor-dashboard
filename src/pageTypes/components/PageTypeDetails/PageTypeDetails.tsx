// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { PageErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

interface PageTypeDetailsProps {
  data?: {
    name: string;
  };
  disabled: boolean;
  errors: PageErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const PageTypeDetails: React.FC<PageTypeDetailsProps> = props => {
  const { data, disabled, errors, onChange } = props;
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <TextField
          disabled={disabled}
          fullWidth
          error={!!formErrors.name}
          helperText={getPageErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage({
            id: "jWna9Q",
            defaultMessage: "Content Type Name",
          })}
          name="name"
          data-test-id="page-type-name"
          onChange={onChange}
          value={data.name}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PageTypeDetails.defaultProps = {
  errors: [],
};
PageTypeDetails.displayName = "PageTypeDetails";
export default PageTypeDetails;
