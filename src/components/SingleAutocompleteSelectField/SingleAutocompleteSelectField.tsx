import { InputProps } from "@material-ui/core/Input";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { commonMessages } from "@saleor/intl";
import { FetchMoreProps } from "@saleor/types";
import classNames from "classnames";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import { filter } from "fuzzaldrin";
import React, { useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import ArrowDropdownIcon from "../../icons/ArrowDropdown";
import Debounce, { DebounceProps } from "../Debounce";
import SingleAutocompleteSelectFieldContent, {
  SingleAutocompleteActionType,
  SingleAutocompleteChoiceType
} from "./SingleAutocompleteSelectFieldContent";

const messages = defineMessages({
  invalidValue: {
    defaultMessage: "Value is invalid"
  }
});

const useStyles = makeStyles(
  {
    container: {
      flexGrow: 1,
      position: "relative"
    }
  },
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
  choices: SingleAutocompleteChoiceType[];
  value: string;
  disabled?: boolean;
  placeholder?: string;
  allowCustomValues?: boolean;
  helperText?: string;
  label?: string;
  InputProps?: InputProps;
  fetchChoices?: (value: string) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
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
    ...rest
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const [invalidValueError, setInvalidValueError] = useState<boolean>(false);

  const handleChange = (
    item: string,
    stateAndHelpers: ControllerStateAndHelpers
  ) => {
    setInvalidValueError(false);

    onChange({
      target: {
        name,
        value: item
      }
    } as any);
    stateAndHelpers.reset({
      inputValue: item
    });
  };

  return (
    <DebounceAutocomplete debounceFn={fetchChoices}>
      {debounceFn => (
        <Downshift
          defaultInputValue={displayValue}
          itemToString={() => displayValue || ""}
          onInputValueChange={value => debounceFn(value)}
          onSelect={handleChange}
          selectedItem={value}
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
            reset
          }) => {
            const isError = error || invalidValueError;

            const isCustomValueSelected =
              choices && selectedItem
                ? choices.filter(c => c.value === selectedItem).length === 0
                : false;

            const isValueInValues = !!choices.find(
              ({ value: choiceId }) => choiceId === inputValue
            );

            const isValueInLabels = !!choices.find(
              choice => choice.label.toLowerCase() === inputValue.toLowerCase()
            );

            if (!isValueInLabels && isValueInValues) {
              reset({ inputValue: displayValue });
            }

            const displayCustomValue = !!(
              inputValue &&
              inputValue.length > 0 &&
              allowCustomValues &&
              !isValueInLabels
            );

            const handleSetInvalidValueError = () => {
              if (allowCustomValues) {
                return;
              }

              setInvalidValueError(!isValueInLabels);
            };

            const handleBlur = () => {
              closeMenu();
              handleSetInvalidValueError();
            };

            const getHelperText = () => {
              if (error) {
                return helperText;
              }

              if (invalidValueError) {
                return intl.formatMessage(
                  !!inputValue
                    ? messages.invalidValue
                    : commonMessages.requiredField
                );
              }

              return "";
            };

            return (
              <div
                className={classNames(classes.container, className)}
                {...rest}
              >
                <TextField
                  InputProps={{
                    ...InputProps,
                    ...getInputProps({
                      placeholder
                    }),
                    endAdornment: (
                      <div>
                        <ArrowDropdownIcon />
                      </div>
                    ),
                    error: isError,
                    id: undefined,
                    onBlur: handleBlur,
                    onClick: toggleMenu
                  }}
                  error={isError}
                  disabled={disabled}
                  helperText={getHelperText()}
                  label={label}
                  fullWidth={true}
                />
                {isOpen && (!!inputValue || !!choices.length) && (
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
      <DebounceAutocomplete debounceFn={fetchChoices}>
        {debounceFn => (
          <SingleAutocompleteSelectFieldComponent
            choices={choices}
            {...rest}
            fetchChoices={debounceFn}
          />
        )}
      </DebounceAutocomplete>
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
