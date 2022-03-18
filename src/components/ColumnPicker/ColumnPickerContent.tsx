import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography
} from "@material-ui/core";
import { FormChange } from "@saleor/hooks/useForm";
import { buttonMessages } from "@saleor/intl";
import { Button, CloseIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { FetchMoreProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "../MultiAutocompleteSelectField";
import messages from "./messages";

export interface ColumnPickerContentProps extends Partial<FetchMoreProps> {
  choices: MultiAutocompleteChoiceType[];
  displayValues: MultiAutocompleteChoiceType[];
  selectedColumns: string[];
  onCancel: () => void;
  onChange: FormChange;
  onReset: () => void;
  onSave: () => void;
  onQueryChange: (query: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row-reverse",
      gap: theme.spacing(1),
      paddingBottom: theme.spacing(2)
    },
    content: {
      paddingBottom: theme.spacing(2),
      width: 450
    },
    subHeader: {
      fontWeight: 500,
      letterSpacing: "0.1rem",
      textTransform: "uppercase",
      marginBottom: theme.spacing(1)
    }
  }),
  { name: "ColumnPickerContent" }
);

const ColumnPickerContent: React.FC<ColumnPickerContentProps> = props => {
  const {
    choices,
    displayValues,
    hasMore,
    selectedColumns,
    onCancel,
    onChange,
    onFetchMore,
    onReset,
    onSave,
    onQueryChange
  } = props;
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card elevation={8}>
      <CardHeader
        action={
          <IconButton variant="secondary" onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        }
        title={intl.formatMessage(messages.title)}
      />
      <CardContent className={classes.content}>
        <Typography
          color="textSecondary"
          variant="caption"
          className={classes.subHeader}
        >
          {intl.formatMessage(messages.columnSubheader)}
        </Typography>
        <MultiAutocompleteSelectField
          choices={choices}
          label={intl.formatMessage(messages.columnLabel)}
          name="columns"
          value={selectedColumns}
          displayValues={displayValues}
          onChange={onChange}
          fetchChoices={onQueryChange}
          hasMore={hasMore}
          fetchOnFocus
          onFetchMore={onFetchMore}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Button variant="primary" onClick={onSave}>
          <FormattedMessage {...buttonMessages.save} />
        </Button>
        <Button color="text" variant="secondary" onClick={onReset}>
          <FormattedMessage {...buttonMessages.reset} />
        </Button>
      </CardActions>
    </Card>
  );
};

export default ColumnPickerContent;
