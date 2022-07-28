import {
  Popper,
  PopperPlacementType,
  TextField,
  Typography,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import CloseIcon from "@material-ui/icons/Close";
import Debounce, { DebounceProps } from "@saleor/components/Debounce";
import { ChevronIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { FetchMoreProps } from "@saleor/types";
import classNames from "classnames";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import { filter } from "fuzzaldrin";
import React from "react";

import MultiAutocompleteSelectFieldContent, {
  MultiAutocompleteActionType,
  MultiAutocompleteChoiceType,
} from "./MultiAutocompleteSelectFieldContent";

const useStyles = makeStyles(
  theme => ({
    chip: {
      width: "100%",
    },
    chipClose: {
      height: 32,
      padding: 0,
      width: 32,
    },
    chipContainer: {
      display: "flex",
      flexDirection: "column",
      marginTop: theme.spacing(1),
    },
    chipInner: {
      "& svg": {
        color: theme.palette.primary.contrastText,
      },
      alignItems: "center",
      background: fade(theme.palette.primary.main, 0.8),
      borderRadius: 18,
      color: theme.palette.primary.contrastText,
      display: "flex",
      justifyContent: "space-between",
      margin: theme.spacing(1, 0),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    chipLabel: {
      color: theme.palette.primary.contrastText,
    },
    container: {
      flexGrow: 1,
      position: "relative",
    },
    disabledChipInner: {
      "& svg": {
        color: theme.palette.grey[200],
      },
      alignItems: "center",
      background: fade(theme.palette.grey[400], 0.8),
      borderRadius: 18,
      color: theme.palette.primary.contrastText,
      display: "flex",
      justifyContent: "space-between",
      margin: theme.spacing(1, 0),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    adornment: {
      color: theme.palette.saleor.main[3],
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      "& svg": {
        transition: theme.transitions.duration.shorter + "ms",
      },
    },
    adornmentRotate: {
      "& svg": {
        transform: "rotate(180deg)",
      },
    },
  }),
  { name: "MultiAutocompleteSelectField" },
);

export interface MultiAutocompleteSelectFieldProps
  extends Partial<FetchMoreProps> {
  add?: MultiAutocompleteActionType;
  allowCustomValues?: boolean;
  displayValues: MultiAutocompleteChoiceType[];
  error?: boolean;
  name: string;
  choices: MultiAutocompleteChoiceType[];
  value: string[];
  loading?: boolean;
  placeholder?: string;
  helperText?: string;
  label?: string;
  disabled?: boolean;
  testId?: string;
  fetchChoices?: (value: string) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
  onBlur?: () => void;
  fetchOnFocus?: boolean;
  endAdornment?: React.ReactNode;
  popperPlacement?: PopperPlacementType;
}

const DebounceAutocomplete: React.ComponentType<DebounceProps<
  string
>> = Debounce;

const MultiAutocompleteSelectFieldComponent: React.FC<MultiAutocompleteSelectFieldProps> = props => {
  const {
    add,
    allowCustomValues,
    choices,
    displayValues,
    error,
    hasMore,
    helperText,
    label,
    loading,
    name,
    placeholder,
    value,
    disabled,
    testId,
    fetchChoices,
    onChange,
    onBlur,
    onFetchMore,
    fetchOnFocus,
    endAdornment,
    popperPlacement = "bottom-end",
    ...rest
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLInputElement | null>(null);

  const handleSelect = (
    item: string,
    downshiftOpts?: ControllerStateAndHelpers<string>,
  ) => {
    if (downshiftOpts) {
      downshiftOpts.reset({ inputValue: "", isOpen: true });
    }
    onChange({
      target: { name, value: item },
    } as any);
  };

  return (
    <>
      <DebounceAutocomplete debounceFn={fetchChoices}>
        {debounceFn => (
          <Downshift
            onInputValueChange={value => debounceFn(value)}
            onSelect={handleSelect}
            itemToString={() => ""}
            // this is to prevent unwanted state updates when the dropdown is closed with an empty value,
            // which downshift interprets as the value being updated with an empty string, causing side-effects
            stateReducer={(state, changes) => {
              if (changes.isOpen === false && state.inputValue === "") {
                delete changes.inputValue;
              }
              return changes;
            }}
          >
            {({
              closeMenu,
              getInputProps,
              getItemProps,
              isOpen,
              toggleMenu,
              getMenuProps,
              highlightedIndex,
              inputValue,
              getToggleButtonProps,
            }) => {
              const displayCustomValue =
                inputValue &&
                inputValue.length > 0 &&
                allowCustomValues &&
                !choices.find(
                  choice =>
                    choice.label.toLowerCase() === inputValue.toLowerCase(),
                );

              return (
                <div className={classes.container} {...rest}>
                  <TextField
                    InputProps={{
                      endAdornment: (
                        <div
                          {...getToggleButtonProps()}
                          className={classNames(classes.adornment, {
                            [classes.adornmentRotate]: isOpen,
                          })}
                        >
                          {endAdornment}
                          <ChevronIcon />
                        </div>
                      ),
                      ref: anchor,
                      onFocus: () => {
                        if (fetchOnFocus) {
                          fetchChoices(inputValue);
                        }
                      },
                    }}
                    inputProps={{
                      ...getInputProps({
                        placeholder,
                        testId,
                        onClick: toggleMenu,
                      }),
                      ...getMenuProps(),
                    }}
                    error={error}
                    helperText={helperText}
                    label={label}
                    fullWidth={true}
                    disabled={disabled}
                    onBlur={onBlur}
                  />
                  {isOpen && (
                    <Popper
                      anchorEl={anchor.current}
                      open={isOpen}
                      style={{
                        width: anchor.current.clientWidth,
                        zIndex: 1301,
                      }}
                      placement={popperPlacement}
                    >
                      <MultiAutocompleteSelectFieldContent
                        add={
                          add && {
                            ...add,
                            onClick: () => {
                              add.onClick();
                              closeMenu();
                            },
                          }
                        }
                        choices={choices?.filter(
                          choice => !value.includes(choice.value),
                        )}
                        displayCustomValue={displayCustomValue}
                        displayValues={displayValues}
                        getItemProps={getItemProps}
                        hasMore={hasMore}
                        highlightedIndex={highlightedIndex}
                        loading={loading}
                        inputValue={inputValue}
                        onFetchMore={onFetchMore}
                      />
                    </Popper>
                  )}
                </div>
              );
            }}
          </Downshift>
        )}
      </DebounceAutocomplete>
      <div className={classes.chipContainer}>
        {displayValues.map(value => (
          <div className={classes.chip} key={value.value}>
            <div
              className={
                !value.disabled ? classes.chipInner : classes.disabledChipInner
              }
            >
              <Typography className={classes.chipLabel}>
                {value.label}
              </Typography>

              <IconButton
                hoverOutline={false}
                variant="secondary"
                data-test-id={testId ? `${testId}-remove` : "remove"}
                className={classes.chipClose}
                disabled={value.disabled}
                onClick={() => handleSelect(value.value)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const MultiAutocompleteSelectField: React.FC<MultiAutocompleteSelectFieldProps> = ({
  choices,
  fetchChoices,
  testId,
  ...props
}) => {
  const [query, setQuery] = React.useState("");

  if (fetchChoices) {
    return (
      <MultiAutocompleteSelectFieldComponent
        testId={testId}
        choices={choices}
        {...props}
        fetchChoices={fetchChoices}
      />
    );
  }

  return (
    <MultiAutocompleteSelectFieldComponent
      fetchChoices={q => setQuery(q || "")}
      choices={filter(choices, query, {
        key: "label",
      })}
      {...props}
    />
  );
};

MultiAutocompleteSelectField.displayName = "MultiAutocompleteSelectField";
export default MultiAutocompleteSelectField;
