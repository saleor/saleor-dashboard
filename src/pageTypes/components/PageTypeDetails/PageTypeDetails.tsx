// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import { PageErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Card, CardContent, TextField } from "@material-ui/core";
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
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
PageTypeDetails.defaultProps = {
  errors: [],
};
PageTypeDetails.displayName = "PageTypeDetails";
export default PageTypeDetails;
