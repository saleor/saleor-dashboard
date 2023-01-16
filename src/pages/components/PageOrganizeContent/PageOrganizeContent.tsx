import CardTitle from "@dashboard/components/CardTitle";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "@dashboard/components/SingleAutocompleteSelectField";
import { PageDetailsFragment, PageErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { FetchMoreProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageFormData } from "../PageDetailsPage/form";

export interface PageOrganizeContentProps {
  canChangeType: boolean;
  data: PageFormData;
  pageType?: PageDetailsFragment["pageType"];
  pageTypeInputDisplayValue?: string;
  errors: PageErrorFragment[];
  disabled: boolean;
  pageTypes: SingleAutocompleteChoiceType[];
  onPageTypeChange?: FormChange;
  fetchPageTypes?: (data: string) => void;
  fetchMorePageTypes?: FetchMoreProps;
}

const useStyles = makeStyles(
  theme => ({
    label: {
      marginBottom: theme.spacing(0.5),
    },
  }),
  { name: "PageOrganizeContent" },
);

const PageOrganizeContent: React.FC<PageOrganizeContentProps> = props => {
  const {
    canChangeType,
    data,
    pageType,
    pageTypeInputDisplayValue,
    errors,
    disabled,
    pageTypes,
    onPageTypeChange,
    fetchPageTypes,
    fetchMorePageTypes,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["pageType"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "jU9GPX",
          defaultMessage: "Organize Content",
          description: "section header",
        })}
      />
      <CardContent>
        {canChangeType ? (
          <SingleAutocompleteSelectField
            data-test-id="page-types-autocomplete-select"
            disabled={disabled}
            displayValue={pageTypeInputDisplayValue}
            label={intl.formatMessage({
              id: "W5SK5c",
              defaultMessage: "Select content type",
            })}
            error={!!formErrors.pageType}
            helperText={getPageErrorMessage(formErrors.pageType, intl)}
            name={"pageType" as keyof PageFormData}
            onChange={onPageTypeChange}
            value={data.pageType?.id}
            choices={pageTypes}
            InputProps={{
              autoComplete: "off",
            }}
            fetchChoices={fetchPageTypes}
            {...fetchMorePageTypes}
          />
        ) : (
          <>
            <Typography className={classes.label} variant="caption">
              <FormattedMessage id="ufD5Jr" defaultMessage="Content type" />
            </Typography>
            <Typography>{pageType?.name}</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};
PageOrganizeContent.displayName = "PageOrganizeContent";
export default PageOrganizeContent;
