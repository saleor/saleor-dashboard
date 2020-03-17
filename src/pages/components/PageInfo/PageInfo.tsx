import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import RichTextEditor from "@saleor/components/RichTextEditor";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import { PageErrorFragment } from "@saleor/pages/types/PageErrorFragment";
import getPageErrorMessage from "@saleor/utils/errors/page";
import { maybe } from "../../../misc";
import { PageDetails_page } from "../../types/PageDetails";
import { FormData } from "../PageDetailsPage";

export interface PageInfoProps {
  data: FormData;
  disabled: boolean;
  errors: PageErrorFragment[];
  page: PageDetails_page;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "PageInfo" }
);

const PageInfo: React.FC<PageInfoProps> = props => {
  const { data, disabled, errors, page, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["title", "contentJson"], errors);

  return (
    <Card className={classes.root}>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.title}
          fullWidth
          helperText={getPageErrorMessage(formErrors.title, intl)}
          label={intl.formatMessage({
            defaultMessage: "Title",
            description: "page title"
          })}
          name={"title" as keyof FormData}
          value={data.title}
          onChange={onChange}
        />
        <FormSpacer />
        <RichTextEditor
          disabled={disabled}
          error={!!formErrors.contentJson}
          helperText={getPageErrorMessage(formErrors.contentJson, intl)}
          initial={maybe(() => JSON.parse(page.contentJson))}
          label={intl.formatMessage({
            defaultMessage: "Content",
            description: "page content"
          })}
          name={"content" as keyof FormData}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
PageInfo.displayName = "PageInfo";
export default PageInfo;
