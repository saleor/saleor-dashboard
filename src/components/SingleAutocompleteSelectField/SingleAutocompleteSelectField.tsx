import { ExtendedFormHelperTextProps } from "@dashboard/channels/components/ChannelForm/types";
import { FetchMoreProps } from "@dashboard/types";
import {
  InputBase,
  OutlinedInputProps,
  Popper,
  PopperPlacementType,
  TextField,
} from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import { ChevronIcon } from "@saleor/macaw-ui";
import clsx from "clsx";
import Downshift from "downshift";
import Fuse from "fuse.js";
import React from "react";

import Debounce, { DebounceProps } from "../Debounce";
import SingleAutocompleteSelectFieldContent, {
  SingleAutocompleteActionType,
  SingleAutocompleteChoiceType,
} from "./SingleAutocompleteSelectFieldContent";
import { useStyles } from "./styles";

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
  autocomplete?: string;
  fetchChoices?: (value: string) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
  fetchOnFocus?: boolean;
  FormHelperTextProps?: ExtendedFormHelperTextProps;
  nakedInput?: boolean;
  onBlur?: () => void;
  popperPlacement?: PopperPlacementType;
  id?: string;
}

const DebounceAutocomplete: React.ComponentType<DebounceProps<string>> =
  Debounce;

const SingleAutocompleteSelectFieldComponent: React.FC<
  SingleAutocompleteSelectFieldProps
> = props => {
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
    autocomplete,
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
    popperPlacement = "bottom-end",
    id,
    ...rest
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement | null>(null);
  const input = React.useRef<HTMLInputElement | null>(null);

  const handleChange = (item: string) => {
    onChange({
      target: {
        name,
        value: item,
      },
    } as any);
  };

  return (
    <DebounceAutocomplete debounceFn={fetchChoices}>
      {fetchChoicesDebounced => (
        <Downshift
          itemToString={() => displayValue || ""}
          onInputValueChange={value => fetchChoicesDebounced(value)}
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
          }) => {
            const isCustomValueSelected =
              choices && selectedItem
                ? choices.filter(c => c.value === selectedItem).length === 0
                : false;

            const choiceFromInputValue = choices.find(
              ({ value: choiceId }) => choiceId === inputValue,
            );

            const isValueInValues = !!choiceFromInputValue;

            const isValueInLabels = !!choices.find(
              choice => choice.label === inputValue,
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

            const handleFocus = () => {
              if (fetchOnFocus) {
                fetchChoices(inputValue);
              }

              if (input.current) {
                input.current.select();
              }
            };

            const handleToggleMenu = () => {
              if (disabled) {
                return;
              }
              toggleMenu();
            };

            const TextFieldComponent = nakedInput ? InputBase : TextField;

            const commonInputProps = {
              ...InputProps,
              endAdornment: (
                <div
                  onClick={() => {
                    handleToggleMenu();
                    handleFocus();
                  }}
                  className={clsx(classes.adornment, {
                    [classes.adornmentRotate]: isOpen,
                  })}
                >
                  <ChevronIcon />
                </div>
              ),
              error,
              id: undefined,
              onFocus: handleFocus,
              ref: anchor,
            };

            const nakedInputProps = nakedInput
              ? {
                  "aria-label": "naked",
                  ...commonInputProps,
                  autoFocus: true,
                  className: classes.nakedInput,
                  onBlur: handleBlur,
                }
              : {};

            return (
              <div
                className={clsx(
                  classes.container,
                  "click-outside-ignore",
                  className,
                )}
                {...rest}
              >
                <TextFieldComponent
                  {...nakedInputProps}
                  InputProps={commonInputProps}
                  // Downshift doesn't seem to be fully compatible with MUI
                  // https://github.com/downshift-js/downshift/issues/718
                  inputProps={{
                    ...(getInputProps({
                      placeholder,
                      autocomplete,
                      onClick: handleToggleMenu,
                    }) as OutlinedInputProps["inputProps"]),
                  }}
                  error={error}
                  disabled={disabled}
                  helperText={helperText}
                  FormHelperTextProps={FormHelperTextProps}
                  label={label}
                  fullWidth={true}
                  onBlur={onBlur}
                  inputRef={input}
                  id={id}
                />
                {isOpen && (!!inputValue || !!choices.length) && (
                  <Popper
                    anchorEl={anchor.current}
                    open={isOpen}
                    style={{ width: anchor.current.clientWidth, zIndex: 1301 }}
                    placement={popperPlacement}
                  >
                    <SingleAutocompleteSelectFieldContent
                      add={
                        !!add && {
                          ...add,
                          onClick: () => {
                            add.onClick();
                            closeMenu();
                          },
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

const SingleAutocompleteSelectField: React.FC<
  SingleAutocompleteSelectFieldProps
> = ({ choices, fetchChoices, ...rest }) => {
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

  const fuse = new Fuse(choices, { keys: ["label"] });

  return (
    <SingleAutocompleteSelectFieldComponent
      fetchChoices={q => setQuery(q || "")}
      choices={query !== "" ? fuse.search(query).map(v => v.item) : choices}
      {...rest}
    />
  );
};

export default SingleAutocompleteSelectField;
