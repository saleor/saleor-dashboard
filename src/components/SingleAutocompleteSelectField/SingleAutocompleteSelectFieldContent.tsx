import chevronDown from "@assets/images/ChevronDown.svg";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Add from "@material-ui/icons/Add";
import useElementScroll, {
  isScrolledToBottom
} from "@saleor/hooks/useElementScroll";
import { FetchMoreProps } from "@saleor/types";
import classNames from "classnames";
import { GetItemPropsOptions } from "downshift";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import Hr from "../Hr";

const menuItemHeight = 46;
const maxMenuItems = 5;
const offset = 24;

export interface SingleAutocompleteChoiceType {
  label: string;
  value: any;
}
export interface SingleAutocompleteActionType {
  label: string;
  onClick: () => void;
}
export interface SingleAutocompleteSelectFieldContentProps
  extends Partial<FetchMoreProps> {
  add?: SingleAutocompleteActionType;
  choices: SingleAutocompleteChoiceType[];
  displayCustomValue: boolean;
  emptyOption: boolean;
  getItemProps: (options: GetItemPropsOptions) => any;
  highlightedIndex: number;
  inputValue: string;
  isCustomValueSelected: boolean;
  selectedItem: any;
}

const useStyles = makeStyles(
  theme => ({
    add: {
      background: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "100%",
      height: 24,
      marginRight: theme.spacing(),
      width: 24
    },
    arrowContainer: {
      position: "relative"
    },
    arrowInnerContainer: {
      alignItems: "center",
      background:
        theme.palette.type === "light"
          ? theme.palette.grey[50]
          : theme.palette.grey[900],
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
      maxHeight: menuItemHeight * maxMenuItems + theme.spacing(2),
      overflow: "scroll",
      padding: 8
    },
    hide: {
      opacity: 0,
      zIndex: -1
    },
    hr: {
      margin: theme.spacing(1, 0)
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
      marginTop: theme.spacing(),
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
  customValue: boolean,
  add: boolean
) {
  let choiceIndex = index;
  if (emptyValue) {
    choiceIndex += 1;
  }
  if (customValue || add) {
    choiceIndex += 2;
  }

  return choiceIndex;
}

const sliceSize = 20;

const SingleAutocompleteSelectFieldContent: React.FC<SingleAutocompleteSelectFieldContentProps> = props => {
  const {
    add,
    choices,
    displayCustomValue,
    emptyOption,
    getItemProps,
    hasMore,
    loading,
    inputValue,
    isCustomValueSelected,
    selectedItem,
    onFetchMore
  } = props;

  if (!!add && !!displayCustomValue) {
    throw new Error("Add and custom value cannot be displayed simultaneously");
  }

  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement>();
  const scrollPosition = useElementScroll(anchor);
  const [calledForMore, setCalledForMore] = React.useState(false);
  const [slice, setSlice] = React.useState(sliceSize);

  const scrolledToBottom = isScrolledToBottom(anchor, scrollPosition, offset);

  React.useEffect(() => {
    if (!calledForMore && onFetchMore && scrolledToBottom) {
      onFetchMore();
      setCalledForMore(true);
    } else if (scrolledToBottom) {
      setSlice(slice => slice + sliceSize);
    }
  }, [scrolledToBottom]);

  React.useEffect(() => {
    setSlice(sliceSize);
    if (anchor.current?.scrollTo) {
      anchor.current.scrollTo({
        top: 0
      });
    }
  }, [choices?.length]);

  React.useEffect(() => {
    if (calledForMore && !loading) {
      setCalledForMore(false);
    }
  }, [loading]);

  const emptyOptionProps = getItemProps({
    item: ""
  });

  return (
    <Paper className={classes.root}>
      <div
        className={classes.content}
        ref={anchor}
        data-test="autocomplete-dropdown"
      >
        {choices.length > 0 || displayCustomValue ? (
          <>
            {emptyOption && (
              <MenuItem
                className={classes.menuItem}
                component="div"
                data-test="singleautocomplete-select-option"
                data-test-type="empty"
                {...emptyOptionProps}
              >
                <Typography color="textSecondary">
                  <FormattedMessage defaultMessage="None" />
                </Typography>
              </MenuItem>
            )}
            {add && (
              <MenuItem
                className={classes.menuItem}
                component="div"
                {...getItemProps({
                  item: inputValue
                })}
                data-test="singleautocomplete-select-option-add"
                data-test-type="add"
                onClick={add.onClick}
              >
                <Add color="primary" className={classes.add} />
                <Typography color="primary">{add.label}</Typography>
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
                data-test="singleautocomplete-select-option"
                data-test-type="custom"
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
            {choices.length > 0 && (!!add || displayCustomValue) && (
              <Hr className={classes.hr} />
            )}
            {choices.slice(0, slice).map((suggestion, index) => {
              const choiceIndex = getChoiceIndex(
                index,
                emptyOption,
                displayCustomValue,
                !!add
              );

              return (
                <MenuItem
                  className={classes.menuItem}
                  key={JSON.stringify(suggestion)}
                  selected={selectedItem === suggestion.value}
                  component="div"
                  {...getItemProps({
                    index: choiceIndex,
                    item: suggestion.value
                  })}
                  data-test="singleautocomplete-select-option"
                  data-test-value={suggestion.value}
                  data-test-type="option"
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
            data-test="singleautocomplete-select-no-options"
          >
            <FormattedMessage defaultMessage="No results found" />
          </MenuItem>
        )}
      </div>
      {choices.length > maxMenuItems && (
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
      )}
    </Paper>
  );
};

SingleAutocompleteSelectFieldContent.displayName =
  "SingleAutocompleteSelectFieldContent";
export default SingleAutocompleteSelectFieldContent;
