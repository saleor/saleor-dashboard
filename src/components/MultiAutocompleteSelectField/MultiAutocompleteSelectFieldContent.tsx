import chevronDown from "@assets/images/ChevronDown.svg";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import Checkbox from "@saleor/components/Checkbox";
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

export interface MultiAutocompleteActionType {
  label: string;
  onClick: () => void;
}
export interface MultiAutocompleteChoiceType {
  label: string;
  value: any;
  disabled?: boolean;
}
export interface MultiAutocompleteSelectFieldContentProps
  extends Partial<FetchMoreProps> {
  add?: MultiAutocompleteActionType;
  choices: MultiAutocompleteChoiceType[];
  displayCustomValue: boolean;
  displayValues: MultiAutocompleteChoiceType[];
  getItemProps: (options: GetItemPropsOptions) => void;
  highlightedIndex: number;
  inputValue: string;
}

const useStyles = makeStyles(
  theme => ({
    add: {
      background: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "100%",
      height: 24,
      margin: theme.spacing(),
      width: 24
    },
    addIcon: {
      height: 24,
      margin: 9,
      width: 20
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
    checkbox: {
      height: 24,
      width: 20
    },
    content: {
      maxHeight: menuItemHeight * maxMenuItems + theme.spacing(2),
      overflowY: "scroll",
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
      "&:focus": {
        backgroundColor: [
          theme.palette.background.default,
          "!important"
        ] as any,
        color: theme.palette.primary.main,
        fontWeight: 400
      },
      "&:hover": {
        backgroundColor: [
          theme.palette.background.default,
          "!important"
        ] as any,
        color: theme.palette.primary.main,
        fontWeight: 700
      },
      borderRadius: 4,
      display: "grid",
      gridColumnGap: theme.spacing(1),
      gridTemplateColumns: "30px 1fr",
      height: "auto",
      marginBottom: theme.spacing(0.5),
      padding: 0,
      whiteSpace: "normal"
    },
    menuItemLabel: {
      overflowWrap: "break-word"
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
    name: "MultiAutocompleteSelectFieldContent"
  }
);

function getChoiceIndex(
  index: number,
  displayValues: MultiAutocompleteChoiceType[],
  displayCustomValue: boolean,
  add: boolean
) {
  let choiceIndex = index;
  if (add || displayCustomValue) {
    choiceIndex += 2;
  }
  if (displayValues.length > 0) {
    choiceIndex += 1 + displayValues.length;
  }

  return choiceIndex;
}

const MultiAutocompleteSelectFieldContent: React.FC<MultiAutocompleteSelectFieldContentProps> = props => {
  const {
    add,
    choices,
    displayCustomValue,
    displayValues,
    getItemProps,
    hasMore,
    highlightedIndex,
    loading,
    inputValue,
    onFetchMore
  } = props;

  if (!!add && !!displayCustomValue) {
    throw new Error("Add and custom value cannot be displayed simultaneously");
  }

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
        {choices.length > 0 ||
        displayValues.length > 0 ||
        displayCustomValue ? (
          <>
            {add && (
              <MenuItem
                className={classes.menuItem}
                component="div"
                {...getItemProps({
                  item: inputValue
                })}
                data-test="multiautocomplete-select-option-add"
                onClick={add.onClick}
              >
                <AddIcon color="primary" className={classes.addIcon} />
                <Typography color="primary">{add.label}</Typography>
              </MenuItem>
            )}
            {displayCustomValue && (
              <MenuItem
                className={classes.menuItem}
                key="customValue"
                component="div"
                {...getItemProps({
                  item: inputValue
                })}
                data-test="multiautocomplete-select-option"
              >
                <AddIcon className={classes.addIcon} color="primary" />
                <FormattedMessage
                  defaultMessage="Add new value: {value}"
                  description="add custom select input option"
                  values={{
                    value: inputValue
                  }}
                />
              </MenuItem>
            )}
            {(choices.length > 0 || displayValues.length > 0) &&
              displayCustomValue && <Hr className={classes.hr} />}
            {displayValues.map(value => (
              <MenuItem
                className={classes.menuItem}
                key={value.value}
                selected={true}
                disabled={value.disabled}
                component="div"
                {...getItemProps({
                  item: value.value
                })}
                data-test="multiautocomplete-select-option"
              >
                <Checkbox
                  className={classes.checkbox}
                  checked={true}
                  disabled={value.disabled}
                  disableRipple
                />
                <span className={classes.menuItemLabel}>{value.label}</span>
              </MenuItem>
            ))}
            {displayValues.length > 0 && choices.length > 0 && (
              <Hr className={classes.hr} />
            )}
            {choices.map((suggestion, index) => {
              const choiceIndex = getChoiceIndex(
                index,
                displayValues,
                displayCustomValue,
                !!add
              );

              return (
                <MenuItem
                  className={classes.menuItem}
                  key={suggestion.value}
                  selected={highlightedIndex === choiceIndex}
                  disabled={suggestion.disabled}
                  component="div"
                  {...getItemProps({
                    index: choiceIndex,
                    item: suggestion.value
                  })}
                  data-test="multiautocomplete-select-option"
                >
                  <Checkbox
                    checked={false}
                    disabled={suggestion.disabled}
                    className={classes.checkbox}
                    disableRipple
                  />
                  <span className={classes.menuItemLabel}>
                    {suggestion.label}
                  </span>
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
            data-test="multiautocomplete-select-no-options"
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

MultiAutocompleteSelectFieldContent.displayName =
  "MultiAutocompleteSelectFieldContent";
export default MultiAutocompleteSelectFieldContent;
