import { Omit } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import React from "react";
import { compareTwoStrings } from "string-similarity";
import SingleAutocompleteSelectFieldContent, {
  SingleAutocompleteChoiceType
} from "./SingleAutocompleteSelectFieldContent";

import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { FetchMoreProps } from "@saleor/types";
import ArrowDropdownIcon from "../../icons/ArrowDropdown";
import Debounce, { DebounceProps } from "../Debounce";

const styles = createStyles({
  container: {
    flexGrow: 1,
    position: "relative"
  }
});

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

interface SingleAutocompleteSelectFieldState {
  choices: Array<{
    label: string;
    value: string;
  }>;
}

const DebounceAutocomplete: React.ComponentType<
  DebounceProps<string>
> = Debounce;

const SingleAutocompleteSelectFieldComponent = withStyles(styles, {
  name: "SingleAutocompleteSelectField"
})(
  ({
    choices,
    classes,
    allowCustomValues,
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
    ...props
  }: SingleAutocompleteSelectFieldProps & WithStyles<typeof styles>) => {
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
              openMenu,
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
                inputValue.length > 0 &&
                allowCustomValues &&
                !choices.find(
                  choice =>
                    choice.label.toLowerCase() === inputValue.toLowerCase()
                );

              return (
                <div className={classes.container} {...props}>
                  <TextField
                    InputProps={{
                      ...InputProps,
                      ...getInputProps({
                        placeholder
                      }),
                      endAdornment: (
                        <div>
                          <ArrowDropdownIcon onClick={toggleMenu} />
                        </div>
                      ),
                      error,
                      id: undefined,
                      onBlur: closeMenu,
                      onFocus: openMenu
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
  }
);

export class SingleAutocompleteSelectField extends React.Component<
  Omit<SingleAutocompleteSelectFieldProps, "classes">,
  SingleAutocompleteSelectFieldState
> {
  state = { choices: this.props.choices };

  handleInputChange = (value: string) =>
    this.setState((_, props) => ({
      choices: props.choices
        .sort((a, b) => {
          const ratingA = compareTwoStrings(value || "", a.label);
          const ratingB = compareTwoStrings(value || "", b.label);
          if (ratingA > ratingB) {
            return -1;
          }
          if (ratingA < ratingB) {
            return 1;
          }
          return 0;
        })
        .slice(0, 5)
    }));

  render() {
    if (!!this.props.fetchChoices) {
      return <SingleAutocompleteSelectFieldComponent {...this.props} />;
    }
    return (
      <SingleAutocompleteSelectFieldComponent
        {...this.props}
        choices={this.state.choices}
        fetchChoices={this.handleInputChange}
      />
    );
  }
}

export default SingleAutocompleteSelectField;
