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
import { getFieldError } from "@saleor/utils/errors";
import { maybe } from "../../../misc";
import { UserError } from "../../../types";
import { PageDetails_page } from "../../types/PageDetails";
import { FormData } from "../PageDetailsPage";

export interface PageInfoProps {
  data: FormData;
  disabled: boolean;
  errors: UserError[];
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

  return (
    <Card className={classes.root}>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "title")}
          fullWidth
          helperText={getFieldError(errors, "title")?.message}
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
          error={!!getFieldError(errors, "contentJson")}
          helperText={getFieldError(errors, "contentJson")?.message}
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
