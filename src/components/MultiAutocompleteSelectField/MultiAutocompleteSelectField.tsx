import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import { filter } from "fuzzaldrin";
import React from "react";

import { fade } from "@material-ui/core/styles/colorManipulator";
import Debounce, { DebounceProps } from "@saleor/components/Debounce";
import ArrowDropdownIcon from "@saleor/icons/ArrowDropdown";
import { FetchMoreProps } from "@saleor/types";
import MultiAutocompleteSelectFieldContent, {
  MultiAutocompleteChoiceType
} from "./MultiAutocompleteSelectFieldContent";

const styles = (theme: Theme) =>
  createStyles({
    chip: {
      width: "100%"
    },
    chipClose: {
      height: 32,
      padding: 0,
      width: 32
    },
    chipContainer: {
      display: "flex",
      flexDirection: "column",
      marginTop: theme.spacing.unit
    },
    chipInner: {
      "& svg": {
        color: theme.palette.primary.contrastText
      },
      alignItems: "center",
      background: fade(theme.palette.primary.main, 0.8),
      borderRadius: 18,
      color: theme.palette.primary.contrastText,
      display: "flex",
      justifyContent: "space-between",
      margin: `${theme.spacing.unit}px 0`,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit
    },
    chipLabel: {
      color: theme.palette.primary.contrastText
    },
    container: {
      flexGrow: 1,
      position: "relative"
    }
  });

export interface MultiAutocompleteSelectFieldProps
  extends Partial<FetchMoreProps> {
  allowCustomValues?: boolean;
  displayValues: MultiAutocompleteChoiceType[];
  name: string;
  choices: MultiAutocompleteChoiceType[];
  value: string[];
  loading?: boolean;
  placeholder?: string;
  helperText?: string;
  label?: string;
  fetchChoices?: (value: string) => void;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const DebounceAutocomplete: React.ComponentType<
  DebounceProps<string>
> = Debounce;

export const MultiAutocompleteSelectFieldComponent = withStyles(styles, {
  name: "MultiAutocompleteSelectField"
})(
  ({
    allowCustomValues,
    choices,
    classes,
    displayValues,
    hasMore,
    helperText,
    label,
    loading,
    name,
    placeholder,
    value,
    fetchChoices,
    onChange,
    onFetchMore,
    ...props
  }: MultiAutocompleteSelectFieldProps & WithStyles<typeof styles>) => {
    const handleSelect = (
      item: string,
      downshiftOpts?: ControllerStateAndHelpers
    ) => {
      if (downshiftOpts) {
        downshiftOpts.reset({ inputValue: "" });
      }
      onChange({
        target: { name, value: item }
      } as any);
    };

    return (
      <>
        <Downshift
          onInputValueChange={fetchChoices}
          onSelect={handleSelect}
          itemToString={() => ""}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            toggleMenu,
            highlightedIndex,
            inputValue
          }) => {
            const displayCustomValue =
              inputValue &&
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
                    ...getInputProps({
                      placeholder
                    }),
                    endAdornment: (
                      <div>
                        <ArrowDropdownIcon onClick={toggleMenu} />
                      </div>
                    ),
                    id: undefined,
                    onClick: toggleMenu
                  }}
                  helperText={helperText}
                  label={label}
                  fullWidth={true}
                />
                {isOpen && (!!inputValue || !!choices.length) && (
                  <MultiAutocompleteSelectFieldContent
                    choices={choices.filter(
                      choice => !value.includes(choice.value)
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
                )}
              </div>
            );
          }}
        </Downshift>
        <div className={classes.chipContainer}>
          {displayValues.map(value => (
            <div className={classes.chip} key={value.value}>
              <div className={classes.chipInner}>
                <Typography className={classes.chipLabel}>
                  {value.label}
                </Typography>
                <IconButton
                  className={classes.chipClose}
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
  }
);
const MultiAutocompleteSelectField: React.FC<
  MultiAutocompleteSelectFieldProps
> = ({ choices, fetchChoices, ...props }) => {
  const [query, setQuery] = React.useState("");
  if (fetchChoices) {
    return (
      <DebounceAutocomplete debounceFn={fetchChoices}>
        {debounceFn => (
          <MultiAutocompleteSelectFieldComponent
            choices={choices}
            {...props}
            fetchChoices={debounceFn}
          />
        )}
      </DebounceAutocomplete>
    );
  }

  return (
    <MultiAutocompleteSelectFieldComponent
      fetchChoices={q => setQuery(q || "")}
      choices={filter(choices, query, {
        key: "label"
      })}
      {...props}
    />
  );
};
MultiAutocompleteSelectField.displayName = "MultiAutocompleteSelectField";
export default MultiAutocompleteSelectField;
