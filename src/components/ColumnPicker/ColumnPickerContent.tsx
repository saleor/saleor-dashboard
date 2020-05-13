import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import useElementScroll from "@saleor/hooks/useElementScroll";
import { buttonMessages } from "@saleor/intl";
import { FetchMoreProps } from "@saleor/types";
import { isSelected } from "@saleor/utils/lists";
import classNames from "classnames";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage } from "react-intl";

import ControlledCheckbox from "../ControlledCheckbox";
import Hr from "../Hr";

export interface ColumnPickerChoice {
  label: string;
  value: string;
}
export interface ColumnPickerContentProps extends Partial<FetchMoreProps> {
  columns: ColumnPickerChoice[];
  selectedColumns: string[];
  total?: number;
  onCancel: () => void;
  onColumnToggle: (column: string) => void;
  onReset: () => void;
  onSave: () => void;
}

const useStyles = makeStyles(
  theme => ({
    actionBar: {
      display: "flex",
      justifyContent: "space-between"
    },
    actionBarContainer: {
      boxShadow: `0px 0px 0px 0px ${theme.palette.background.paper}`,
      transition: theme.transitions.duration.short + "ms"
    },
    cancelButton: {
      marginRight: theme.spacing(2)
    },
    content: {
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
      },
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "repeat(3, 1fr)",
      maxHeight: 256,
      overflowX: "visible",
      overflowY: "scroll",
      padding: theme.spacing(2, 3)
    },
    contentContainer: {
      padding: 0
    },
    dropShadow: {
      boxShadow: `0px -5px 10px 0px ${theme.palette.divider}`
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      gridColumnEnd: "span 3",
      height: theme.spacing(3),
      justifyContent: "center"
    },
    root: {
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
    },
    titleContainer: {
      padding: theme.spacing(1.5, 3.5)
    }
  }),
  { name: "ColumnPickerContent" }
);

const ColumnPickerContent: React.FC<ColumnPickerContentProps> = props => {
  const {
    columns,
    hasMore,
    loading,
    selectedColumns,
    total,
    onCancel,
    onColumnToggle,
    onFetchMore,
    onReset,
    onSave
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement>();
  const scrollPosition = useElementScroll(anchor);

  const dropShadow =
    anchor.current && scrollPosition
      ? scrollPosition.y + anchor.current.clientHeight <
        anchor.current.scrollHeight
      : false;

  return (
    <Card className={classes.root}>
      <CardContent className={classes.titleContainer}>
        <Typography color="textSecondary">
          <FormattedMessage
            defaultMessage="{numberOfSelected} columns selected out of {numberOfTotal}"
            description="pick columns to display"
            values={{
              numberOfSelected: selectedColumns.length,
              numberOfTotal: total || columns.length
            }}
          />
        </Typography>
      </CardContent>
      <Hr />
      {hasMore && onFetchMore ? (
        <InfiniteScroll
          pageStart={0}
          loadMore={onFetchMore}
          hasMore={hasMore}
          useWindow={false}
          threshold={100}
          key="infinite-scroll"
        >
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
                  key={column.value}
                />
              ))}
              {loading && (
                <div className={classes.loadMoreLoaderContainer}>
                  <CircularProgress size={16} />
                </div>
              )}
            </div>
          </CardContent>
        </InfiniteScroll>
      ) : (
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
                key={column.value}
              />
            ))}
          </div>
        </CardContent>
      )}
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
            <Button
              className={classes.cancelButton}
              color="default"
              onClick={onCancel}
            >
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
