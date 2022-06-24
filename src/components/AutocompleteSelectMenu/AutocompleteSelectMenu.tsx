import {
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import Downshift from "downshift";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
  getMenuItemByPath,
  IMenu,
  validateMenuOptions,
} from "../../utils/menu";
import Debounce, { DebounceProps } from "../Debounce";

export interface AutocompleteSelectMenuProps {
  disabled: boolean;
  displayValue: string;
  error: boolean;
  helperText: string;
  label: string;
  loading: boolean;
  name: string;
  options: IMenu;
  testIds?: string[];
  placeholder: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  onInputChange?: (value: string) => void;
}

const validationError: Error = new Error(
  "Values supplied to AutocompleteSelectMenu should be unique",
);

const DebounceAutocomplete: React.ComponentType<DebounceProps<
  string
>> = Debounce;

const useStyles = makeStyles(
  theme => ({
    container: {
      flexGrow: 1,
      position: "relative",
    },
    menuBack: {
      marginLeft: theme.spacing(-0.5),
      marginRight: theme.spacing(1),
    },
    paper: {
      left: 0,
      marginTop: theme.spacing(),
      padding: theme.spacing(),
      position: "absolute",
      right: 0,
      zIndex: 2,
    },
    root: {},
  }),
  { name: "AutocompleteSelectMenu" },
);
const AutocompleteSelectMenu: React.FC<AutocompleteSelectMenuProps> = props => {
  const {
    disabled,
    displayValue,
    error,
    helperText,
    label,
    loading,
    name,
    options,
    testIds,
    placeholder,
    onChange,
    onInputChange,
  } = props;
  const classes = useStyles(props);

  const [isFocused, setIsFocused] = React.useState(false);

  const [inputValue, setInputValue] = React.useState(displayValue || "");

  const [menuPath, setMenuPath] = React.useState<number[]>([]);

  const handleChange = (value: string) =>
    onChange({
      target: {
        name,
        value,
      },
    } as any);

  // Validate if option values are duplicated
  React.useEffect(() => {
    if (!validateMenuOptions(options)) {
      throw validationError;
    }
  }, []);

  // Navigate back to main menu after input field change
  React.useEffect(() => setMenuPath([]), [options]);

  // Reset input value after displayValue change
  React.useEffect(() => setInputValue(displayValue), [displayValue]);

  return (
    <DebounceAutocomplete debounceFn={onInputChange}>
      {debounceFn => (
        <Downshift onSelect={handleChange}>
          {({ getItemProps, isOpen, openMenu, closeMenu, selectItem }) => (
            <div
              className={classes.container}
              data-test-id="container-autocomplete-select"
            >
              <TextField
                InputProps={{
                  endAdornment: isFocused && loading && (
                    <CircularProgress size={16} />
                  ),
                  id: undefined,
                  onBlur() {
                    setIsFocused(false);
                    closeMenu();
                    setMenuPath([]);
                    setInputValue(displayValue || "");
                    debounceFn("");
                  },
                  onChange: event => {
                    debounceFn(event.target.value);
                    setInputValue(event.target.value);
                  },
                  onFocus: () => {
                    openMenu();
                    setIsFocused(true);
                  },
                  placeholder,
                }}
                disabled={disabled}
                error={error}
                helperText={helperText}
                label={label}
                fullWidth={true}
                value={inputValue}
              />
              {isOpen && (
                <Paper className={classes.paper} square>
                  {options.length ? (
                    <>
                      {menuPath.length > 0 && (
                        <MenuItem
                          component="div"
                          {...getItemProps({
                            item: "Back",
                          })}
                          onClick={() =>
                            setMenuPath(menuPath.slice(0, menuPath.length - 2))
                          }
                        >
                          <ArrowBack className={classes.menuBack} />
                          <FormattedMessage {...buttonMessages.back} />
                        </MenuItem>
                      )}
                      {(menuPath.length
                        ? getMenuItemByPath(options, menuPath).children
                        : options
                      ).map((suggestion, index) => (
                        <MenuItem
                          data-test-id={!!testIds ? testIds[index] : ""}
                          key={`${suggestion.value}:${index}`}
                          component="div"
                          {...getItemProps({ item: suggestion.value ?? "" })}
                          onClick={() =>
                            suggestion.value
                              ? selectItem(suggestion.value)
                              : setMenuPath([...menuPath, index])
                          }
                        >
                          {suggestion.label}
                        </MenuItem>
                      ))}
                    </>
                  ) : (
                    <MenuItem disabled component="div">
                      <FormattedMessage
                        id="jHJmjf"
                        defaultMessage="No results"
                      />
                    </MenuItem>
                  )}
                </Paper>
              )}
            </div>
          )}
        </Downshift>
      )}
    </DebounceAutocomplete>
  );
};
AutocompleteSelectMenu.displayName = "AutocompleteSelectMenu";
export default AutocompleteSelectMenu;
