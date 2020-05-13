import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { buttonMessages } from "@saleor/intl";
import Downshift from "downshift";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
  getMenuItemByPath,
  IMenu,
  validateMenuOptions
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
  placeholder: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  onInputChange?: (value: string) => void;
}

const validationError: Error = new Error(
  "Values supplied to AutocompleteSelectMenu should be unique"
);

const DebounceAutocomplete: React.ComponentType<DebounceProps<
  string
>> = Debounce;

const useStyles = makeStyles(
  theme => ({
    container: {
      flexGrow: 1,
      position: "relative"
    },
    menuBack: {
      marginLeft: -theme.spacing(0.5),
      marginRight: theme.spacing(1)
    },
    paper: {
      left: 0,
      marginTop: theme.spacing(),
      padding: theme.spacing(),
      position: "absolute",
      right: 0,
      zIndex: 2
    },
    root: {}
  }),
  { name: "AutocompleteSelectMenu" }
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
    placeholder,
    onChange,
    onInputChange
  } = props;
  const classes = useStyles(props);

  const [inputValue, setInputValue] = React.useState(displayValue || "");
  const [menuPath, setMenuPath] = React.useState<number[]>([]);

  const handleChange = (value: string) =>
    onChange({
      target: {
        name,
        value
      }
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
        <Downshift
          itemToString={item => (item ? item.label : "")}
          onSelect={handleChange}
        >
          {({ getItemProps, isOpen, openMenu, closeMenu, selectItem }) => (
            <div className={classes.container}>
              <TextField
                InputProps={{
                  endAdornment: loading && <CircularProgress size={16} />,
                  id: undefined,
                  onBlur: () => {
                    closeMenu();
                    setMenuPath([]);
                    setInputValue(displayValue);
                  },
                  onChange: event => {
                    debounceFn(event.target.value);
                    setInputValue(event.target.value);
                  },
                  onFocus: () => openMenu(),
                  placeholder
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
                            item: null
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
                          key={suggestion.value}
                          component="div"
                          {...getItemProps({ item: suggestion })}
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
                      <FormattedMessage defaultMessage="No results" />
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
