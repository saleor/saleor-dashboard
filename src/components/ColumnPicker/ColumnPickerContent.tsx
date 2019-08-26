import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import useElementScroll from "@saleor/hooks/useElementScroll";
import { buttonMessages } from "@saleor/intl";
import { isSelected } from "@saleor/utils/lists";
import ControlledCheckbox from "../ControlledCheckbox";
import Hr from "../Hr";

export interface ColumnPickerChoice {
  label: string;
  value: string;
}
export interface ColumnPickerContentProps {
  columns: ColumnPickerChoice[];
  selectedColumns: string[];
  onCancel: () => void;
  onColumnToggle: (column: string) => void;
  onReset: () => void;
  onSave: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  actionBar: {
    display: "flex",
    justifyContent: "space-between"
  },
  actionBarContainer: {
    boxShadow: `0px 0px 0px 0px ${theme.palette.background.paper}`,
    transition: theme.transitions.duration.short + "ms"
  },
  content: {
    display: "grid",
    gridColumnGap: theme.spacing.unit * 3,
    gridTemplateColumns: "repeat(3, 1fr)",
    maxHeight: 256,
    overflowX: "visible",
    overflowY: "scroll",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`
  },
  contentContainer: {
    padding: 0
  },
  dropShadow: {
    boxShadow: `0px -5px 10px 0px ${theme.overrides.MuiCard.root.borderColor}`
  }
}));

const ColumnPickerContent: React.FC<ColumnPickerContentProps> = props => {
  const {
    columns,
    selectedColumns,
    onCancel,
    onColumnToggle,
    onReset,
    onSave
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement>();
  const scrollPosition = useElementScroll(anchor);

  const dropShadow = anchor.current
    ? scrollPosition.y + anchor.current.clientHeight <
      anchor.current.scrollHeight
    : false;

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary">
          <FormattedMessage
            defaultMessage="{numberOfSelected} columns selected out of {numberOfTotal}"
            description="pick columns to display"
            values={{
              numberOfSelected: selectedColumns.length,
              numberOfTotal: columns.length
            }}
          />
        </Typography>
      </CardContent>
      <Hr />
      <CardContent className={classes.contentContainer}>
        <div className={classes.content} ref={anchor}>
          {columns.map(column => (
            <ControlledCheckbox
              checked={isSelected(
                column.value,
                selectedColumns,
                (a, b) => a === b
              )}
              name={column.value}
              label={column.label}
              onChange={() => onColumnToggle(column.value)}
            />
          ))}
        </div>
      </CardContent>
      <Hr />
      <CardContent
        className={classNames(classes.actionBarContainer, {
          [classes.dropShadow]: dropShadow
        })}
      >
        <div className={classes.actionBar}>
          <Button color="default" onClick={onReset}>
            <FormattedMessage defaultMessage="Reset" description="button" />
          </Button>
          <div>
            <Button color="default" onClick={onCancel}>
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
            <Button color="primary" variant="contained" onClick={onSave}>
              <FormattedMessage {...buttonMessages.save} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColumnPickerContent;
