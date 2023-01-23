import { Button } from "@dashboard/components/Button";
import { FormChange } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem,
  Typography,
} from "@material-ui/core";
import {
  Choice,
  CloseIcon,
  IconButton,
  makeStyles,
  MultipleValueAutocomplete,
} from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

export interface ColumnPickerContentProps extends FetchMoreProps {
  choices: Choice[];
  initialValues: Choice[];
  onCancel: () => void;
  onChange: FormChange<string[]>;
  onReset: () => void;
  onSave: () => void;
  onQueryChange: (query: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row-reverse",
      gap: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    content: {
      paddingBottom: theme.spacing(2),
      width: 450,
    },
    subHeader: {
      fontWeight: 500,
      letterSpacing: "0.1rem",
      textTransform: "uppercase",
      marginBottom: theme.spacing(1),
    },
    choicesContainer: {
      maxHeight: 500,
      overflow: "hidden scroll",
      "& span": {
        wordBreak: "break-all",
      },
    },
  }),
  { name: "ColumnPickerContent" },
);

const ColumnPickerContent: React.FC<ColumnPickerContentProps> = props => {
  const {
    choices,
    initialValues,
    loading,
    onCancel,
    onChange,
    onReset,
    onFetchMore,
    onSave,
    onQueryChange,
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
        <MultipleValueAutocomplete
          className={classes.choicesContainer}
          choices={choices}
          enableReinitialize
          fullWidth
          label={intl.formatMessage(messages.columnLabel)}
          loading={loading}
          name="columns"
          initialValue={initialValues}
          onChange={onChange}
          onInputChange={onQueryChange}
          onScrollToBottom={onFetchMore}
        >
          {({ choices, getItemProps }) =>
            choices.map((choice, choiceIndex) => (
              <MenuItem
                key={choice.value}
                {...getItemProps({ item: choice, index: choiceIndex })}
              >
                {choice.label}
              </MenuItem>
            ))
          }
        </MultipleValueAutocomplete>
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
