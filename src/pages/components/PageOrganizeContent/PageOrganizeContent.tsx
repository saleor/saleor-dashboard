import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { PageErrorFragment } from "@saleor/fragments/types/PageErrorFragment";
import { PageTypeFragment } from "@saleor/fragments/types/PageTypeFragment";
import { FormChange } from "@saleor/hooks/useForm";
import { FetchMoreProps } from "@saleor/types";
import { getFormErrors } from "@saleor/utils/errors";
import getPageErrorMessage from "@saleor/utils/errors/page";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageFormData } from "../PageDetailsPage/form";

export interface PageOrganizeContentProps {
  canChangeType: boolean;
  data: PageFormData;
  pageType?: PageTypeFragment;
  pageTypeInputDisplayValue?: string;
  errors: PageErrorFragment[];
  disabled: boolean;
  pageTypes: PageTypeFragment[];
  onPageTypeChange?: FormChange;
  fetchPageTypes?: (data: string) => void;
  fetchMorePageTypes?: FetchMoreProps;
}

const useStyles = makeStyles(
  theme => ({
    label: {
      marginBottom: theme.spacing(0.5)
    }
  }),
  { name: "PageOrganizeContent" }
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
    fetchMorePageTypes
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["pageType"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Organize Content",
          description: "section header"
        })}
      />
      <CardContent>
        {canChangeType ? (
          <SingleAutocompleteSelectField
            disabled={disabled}
            displayValue={pageTypeInputDisplayValue}
            label={intl.formatMessage({
              defaultMessage: "Select content type",
              id: "pageTypeInputLabel"
            })}
            error={!!formErrors.pageType}
            helperText={getPageErrorMessage(formErrors.pageType, intl)}
            name={"pageType" as keyof PageFormData}
            onChange={onPageTypeChange}
            value={data.pageType}
            choices={pageTypes ? mapNodeToChoice(pageTypes) : []}
            InputProps={{
              autoComplete: "off"
            }}
            fetchChoices={fetchPageTypes}
            {...fetchMorePageTypes}
          />
        ) : (
          <>
            <Typography className={classes.label} variant="caption">
              <FormattedMessage defaultMessage="Content type" />
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
