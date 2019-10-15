import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import { GetItemPropsOptions } from "downshift";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import chevronDown from "@assets/images/ChevronDown.svg";
import useElementScroll, {
  isScrolledToBottom
} from "@saleor/hooks/useElementScroll";
import { FetchMoreProps } from "@saleor/types";
import Hr from "../Hr";

const menuItemHeight = 46;
const maxMenuItems = 5;
const offset = 24;

export interface SingleAutocompleteChoiceType {
  label: string;
  value: any;
}
export interface SingleAutocompleteSelectFieldContentProps
  extends Partial<FetchMoreProps> {
  choices: SingleAutocompleteChoiceType[];
  displayCustomValue: boolean;
  emptyOption: boolean;
  getItemProps: (options: GetItemPropsOptions) => void;
  highlightedIndex: number;
  inputValue: string;
  isCustomValueSelected: boolean;
  selectedItem: any;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    arrowContainer: {
      position: "relative"
    },
    arrowInnerContainer: {
      alignItems: "center",
      background: theme.palette.grey[50],
      bottom: 0,
      display: "flex",
      height: 30,
      justifyContent: "center",
      opacity: 1,
      position: "absolute",
      transition: theme.transitions.duration.short + "ms",
      width: "100%"
    },
    content: {
      maxHeight: menuItemHeight * maxMenuItems + theme.spacing.unit * 2,
      overflow: "scroll",
      padding: 8
    },
    hide: {
      opacity: 0
    },
    hr: {
      margin: `${theme.spacing.unit}px 0`
    },
    menuItem: {
      height: "auto",
      whiteSpace: "normal"
    },
    progress: {},
    progressContainer: {
      display: "flex",
      justifyContent: "center"
    },
    root: {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      left: 0,
      marginTop: theme.spacing.unit,
      overflow: "hidden",
      position: "absolute",
      right: 0,
      zIndex: 22
    }
  }),
  {
    name: "SingleAutocompleteSelectFieldContent"
  }
);

function getChoiceIndex(
  index: number,
  emptyValue: boolean,
  customValue: boolean
) {
  let choiceIndex = index;
  if (emptyValue) {
    choiceIndex += 1;
  }
  if (customValue) {
    choiceIndex += 2;
  }

  return choiceIndex;
}

const SingleAutocompleteSelectFieldContent: React.FC<
  SingleAutocompleteSelectFieldContentProps
> = props => {
  const {
    choices,
    displayCustomValue,
    emptyOption,
    getItemProps,
    hasMore,
    highlightedIndex,
    loading,
    inputValue,
    isCustomValueSelected,
    selectedItem,
    onFetchMore
  } = props;

  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement>();
  const scrollPosition = useElementScroll(anchor);
  const [calledForMore, setCalledForMore] = React.useState(false);

  const scrolledToBottom = isScrolledToBottom(anchor, scrollPosition, offset);

  React.useEffect(() => {
    if (!calledForMore && onFetchMore && scrolledToBottom) {
      onFetchMore();
      setCalledForMore(true);
    }
  }, [scrolledToBottom]);

  React.useEffect(() => {
    if (calledForMore && !loading) {
      setCalledForMore(false);
    }
  }, [loading]);

  return (
    <Paper className={classes.root}>
      <div className={classes.content} ref={anchor}>
        {choices.length > 0 || displayCustomValue ? (
          <>
            {emptyOption && (
              <MenuItem
                className={classes.menuItem}
                component="div"
                {...getItemProps({
                  item: ""
                })}
                data-tc="singleautocomplete-select-option"
              >
                <Typography color="textSecondary">
                  <FormattedMessage defaultMessage="None" />
                </Typography>
              </MenuItem>
            )}
            {displayCustomValue && (
              <MenuItem
                className={classes.menuItem}
                key={"customValue"}
                selected={isCustomValueSelected}
                component="div"
                {...getItemProps({
                  item: inputValue
                })}
                data-tc="singleautocomplete-select-option"
              >
                <FormattedMessage
                  defaultMessage="Add new value: {value}"
                  description="add custom select input option"
                  values={{
                    value: inputValue
                  }}
                />
              </MenuItem>
            )}
            {choices.length > 0 && displayCustomValue && (
              <Hr className={classes.hr} />
            )}
            {choices.map((suggestion, index) => {
              const choiceIndex = getChoiceIndex(
                index,
                emptyOption,
                displayCustomValue
              );

              return (
                <MenuItem
                  className={classes.menuItem}
                  key={JSON.stringify(suggestion)}
                  selected={
                    highlightedIndex === choiceIndex ||
                    selectedItem === suggestion.value
                  }
                  component="div"
                  {...getItemProps({
                    index: choiceIndex,
                    item: suggestion.value
                  })}
                  data-tc="singleautocomplete-select-option"
                >
                  {suggestion.label}
                </MenuItem>
              );
            })}
            {hasMore && (
              <>
                <Hr className={classes.hr} />
                <div className={classes.progressContainer}>
                  <CircularProgress className={classes.progress} size={24} />
                </div>
              </>
            )}
          </>
        ) : (
          <MenuItem
            disabled={true}
            component="div"
            data-tc="singleautocomplete-select-no-options"
          >
            <FormattedMessage defaultMessage="No results found" />
          </MenuItem>
        )}
      </div>
      <div className={classes.arrowContainer}>
        <div
          className={classNames(classes.arrowInnerContainer, {
            // Needs to be explicitely compared to false because
            // scrolledToBottom can be either true, false or undefined
            [classes.hide]: scrolledToBottom !== false
          })}
        >
          <SVG src={chevronDown} />
        </div>
      </div>
    </Paper>
  );
};

SingleAutocompleteSelectFieldContent.displayName =
  "SingleAutocompleteSelectFieldContent";
export default SingleAutocompleteSelectFieldContent;
