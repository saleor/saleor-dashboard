import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import RichTextEditor, {
  RichTextEditorChange
} from "@saleor/components/RichTextEditor";
import { PageErrorFragment } from "@saleor/fragments/types/PageErrorFragment";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
import { getFormErrors } from "@saleor/utils/errors";
import getPageErrorMessage from "@saleor/utils/errors/page";
import React from "react";
import { useIntl } from "react-intl";

import { PageData } from "../PageDetailsPage/form";

export interface PageInfoProps {
  data: PageData;
  disabled: boolean;
  errors: PageErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onContentChange: RichTextEditorChange;
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
  const { data, disabled, errors, onChange, onContentChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["title", "content"], errors);

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
          name={"title" as keyof PageData}
          value={data.title}
          onChange={onChange}
        />
        <FormSpacer />
        <RichTextEditor
          data={data.content}
          disabled={disabled}
          error={!!formErrors.content}
          helperText={getPageErrorMessage(formErrors.content, intl)}
          label={intl.formatMessage({
            defaultMessage: "Content",
            description: "page content"
          })}
          name={"content" as keyof PageData}
          onChange={onContentChange}
        />
      </CardContent>
    </Card>
  );
};
PageInfo.displayName = "PageInfo";
export default PageInfo;
