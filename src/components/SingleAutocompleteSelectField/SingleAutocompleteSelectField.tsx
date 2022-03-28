import { InputBase, Popper, TextField } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import { ExtendedFormHelperTextProps } from "@saleor/channels/components/ChannelForm/types";
import { ChevronIcon, makeStyles } from "@saleor/macaw-ui";
import { FetchMoreProps } from "@saleor/types";
import classNames from "classnames";
import Downshift from "downshift";
import { filter } from "fuzzaldrin";
import React from "react";

import Debounce, { DebounceProps } from "../Debounce";
import SingleAutocompleteSelectFieldContent, {
  SingleAutocompleteActionType,
  SingleAutocompleteChoiceType
} from "./SingleAutocompleteSelectFieldContent";

const useStyles = makeStyles(
  theme => ({
    container: {
      flexGrow: 1,
      position: "relative"
    },
    nakedInput: {
      padding: theme.spacing(2, 0)
    },
    adornment: {
      color: theme.palette.saleor.main[3],
      cursor: "pointer",
      userSelect: "none",
      "& svg": {
        transition: theme.transitions.duration.shorter + "ms"
      }
    },
    adornmentRotate: {
      "& svg": {
        transform: "rotate(180deg)"
      }
    }
  }),
  { name: "SingleAutocompleteSelectField" }
);

export interface SingleAutocompleteSelectFieldProps
  extends Partial<FetchMoreProps> {
  add?: SingleAutocompleteActionType;
  className?: string;
  error?: boolean;
  name: string;
  displayValue: string;
  emptyOption?: boolean;
  choices: Array<SingleAutocompleteChoiceType<string, string | JSX.Element>>;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  allowCustomValues?: boolean;
  helperText?: string;
  label?: string;
  InputProps?: InputProps;
  fetchChoices?: (value: string) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
  fetchOnFocus?: boolean;
  FormHelperTextProps?: ExtendedFormHelperTextProps;
  nakedInput?: boolean;
  onBlur?: () => void;
}

const DebounceAutocomplete: React.ComponentType<DebounceProps<
  string
>> = Debounce;

const SingleAutocompleteSelectFieldComponent: React.FC<SingleAutocompleteSelectFieldProps> = props => {
  const {
    add,
    allowCustomValues,
    className,
    choices,
    disabled,
    displayValue,
    emptyOption,
    error,
    hasMore,
    helperText,
    label,
    loading,
    name,
    placeholder,
    value,
    InputProps,
    fetchChoices,
    onChange,
    onFetchMore,
    fetchOnFocus,
    FormHelperTextProps,
    nakedInput = false,
    onBlur,
    ...rest
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement | null>(null);
  const input = React.useRef<HTMLInputElement | null>(null);

  const handleChange = (item: string) => {
    onChange({
      target: {
        name,
        value: item
      }
    } as any);
  };

  return (
    <DebounceAutocomplete debounceFn={fetchChoices}>
      {debounceFn => (
        <Downshift
          itemToString={() => displayValue || ""}
          onInputValueChange={value => debounceFn(value)}
          onSelect={handleChange}
          selectedItem={value || ""}
          // this is to prevent unwanted state updates when the dropdown is closed with an empty value,
          // which downshift interprets as the value being updated with an empty string, causing side-effects
          stateReducer={(_, changes) => {
            if (changes.isOpen === false) {
              delete changes.inputValue;
            }
            return changes;
          }}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            selectedItem,
            toggleMenu,
            closeMenu,
            highlightedIndex,
            reset,
            getToggleButtonProps
          }) => {
            const isCustomValueSelected =
              choices && selectedItem
                ? choices.filter(c => c.value === selectedItem).length === 0
                : false;

            const choiceFromInputValue = choices.find(
              ({ value: choiceId }) => choiceId === inputValue
            );

            const isValueInValues = !!choiceFromInputValue;

            const isValueInLabels = !!choices.find(
              choice => choice.label === inputValue
            );

            const ensureProperValues = (alwaysCheck: boolean = false) => {
              if ((allowCustomValues || isValueInLabels) && !alwaysCheck) {
                return;
              }

              if (isValueInValues && !isValueInLabels) {
                reset({ inputValue: choiceFromInputValue.value });
                return;
              }

              reset({ inputValue: displayValue });
            };

            const displayCustomValue = !!(
              inputValue &&
              inputValue.length > 0 &&
              allowCustomValues &&
              !isValueInLabels
            );

            const handleBlur = () => {
              ensureProperValues(true);
              if (onBlur) {
                onBlur();
              }
              closeMenu();
            };

            const TextFieldComponent = nakedInput ? InputBase : TextField;

            const commonInputProps = {
              ...InputProps,
              endAdornment: (
                <div
                  {...getToggleButtonProps()}
                  className={classNames(classes.adornment, {
                    [classes.adornmentRotate]: isOpen
                  })}
                >
                  <ChevronIcon />
                </div>
              ),
              error,
              id: undefined,
              onFocus: () => {
                if (fetchOnFocus) {
                  fetchChoices(inputValue);
                }
                input.current.select();
              }
            };

            const nakedInputProps = nakedInput
              ? {
                  "aria-label": "naked",
                  ...commonInputProps,
                  autoFocus: true,
                  className: classes.nakedInput,
                  onBlur: handleBlur
                }
              : {};

            return (
              <div
                className={classNames(classes.container, className)}
                {...rest}
              >
                <TextFieldComponent
                  {...nakedInputProps}
                  InputProps={commonInputProps}
                  // Downshift doesn't seem to be fully compatible with MUI
                  // https://github.com/downshift-js/downshift/issues/718
                  inputProps={{
                    ...getInputProps({
                      placeholder,
                      onClick: () => {
                        if (disabled) {
                          return;
                        }
                        toggleMenu();
                      }
                    })
                  }}
                  error={error}
                  disabled={disabled}
                  helperText={helperText}
                  FormHelperTextProps={FormHelperTextProps}
                  label={label}
                  fullWidth={true}
                  onBlur={onBlur}
                  ref={anchor}
                  inputRef={input}
                />
                {isOpen && (!!inputValue || !!choices.length) && (
                  <Popper
                    anchorEl={anchor.current}
                    open={isOpen}
                    style={{ width: anchor.current.clientWidth, zIndex: 1301 }}
                    placement="bottom-end"
                  >
                    <SingleAutocompleteSelectFieldContent
                      add={
                        !!add && {
                          ...add,
                          onClick: () => {
                            add.onClick();
                            closeMenu();
                          }
                        }
                      }
                      choices={choices}
                      displayCustomValue={displayCustomValue}
                      emptyOption={emptyOption}
                      getItemProps={getItemProps}
                      hasMore={hasMore}
                      highlightedIndex={highlightedIndex}
                      loading={loading}
                      inputValue={inputValue}
                      isCustomValueSelected={isCustomValueSelected}
                      selectedItem={selectedItem}
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
  );
};

const SingleAutocompleteSelectField: React.FC<SingleAutocompleteSelectFieldProps> = ({
  choices,
  fetchChoices,
  ...rest
}) => {
  const [query, setQuery] = React.useState("");

  if (fetchChoices) {
    return (
      <SingleAutocompleteSelectFieldComponent
        choices={choices}
        {...rest}
        fetchChoices={fetchChoices}
      />
    );
  }

  return (
    <SingleAutocompleteSelectFieldComponent
      fetchChoices={q => setQuery(q || "")}
      choices={filter(choices, query, {
        key: "label"
      })}
      {...rest}
    />
  );
};

export default SingleAutocompleteSelectField;
