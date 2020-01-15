import { InputProps } from "@material-ui/core/Input";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import { filter } from "fuzzaldrin";
import React from "react";

import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { FetchMoreProps } from "@saleor/types";
import ArrowDropdownIcon from "../../icons/ArrowDropdown";
import Debounce, { DebounceProps } from "../Debounce";
import SingleAutocompleteSelectFieldContent, {
  SingleAutocompleteChoiceType
} from "./SingleAutocompleteSelectFieldContent";

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
    allowCustomValues,
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

  const [prevDisplayValue] = useStateFromProps(displayValue);

  const handleChange = item =>
    onChange({
      target: {
        name,
        value: item
      }
    } as any);

  return (
    <DebounceAutocomplete debounceFn={fetchChoices}>
      {debounceFn => (
        <Downshift
          defaultInputValue={displayValue}
          itemToString={() => displayValue}
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
            const isCustomValueSelected =
              choices && selectedItem
                ? choices.filter(c => c.value === selectedItem).length === 0
                : false;
            const hasInputValueChanged = prevDisplayValue !== displayValue;

            if (hasInputValueChanged) {
              reset({ inputValue: displayValue });
            }

            const displayCustomValue =
              inputValue &&
              inputValue.length > 0 &&
              allowCustomValues &&
              !choices.find(
                choice =>
                  choice.label.toLowerCase() === inputValue.toLowerCase()
              );

            return (
              <div className={classes.container} {...rest}>
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
                    error,
                    id: undefined,
                    onBlur: closeMenu,
                    onClick: toggleMenu
                  }}
                  error={error}
                  disabled={disabled}
                  helperText={helperText}
                  label={label}
                  fullWidth={true}
                />
                {isOpen && (!!inputValue || !!choices.length) && (
                  <SingleAutocompleteSelectFieldContent
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
