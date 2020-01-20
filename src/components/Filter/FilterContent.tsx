import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";
import { FormattedMessage, useIntl, IntlShape } from "react-intl";
import classNames from "classnames";

import makeStyles from "@material-ui/core/styles/makeStyles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { buttonMessages } from "@saleor/intl";
import { TextField } from "@material-ui/core";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import Hr from "../Hr";
import Checkbox from "../Checkbox";
import SingleSelectField from "../SingleSelectField";
import { SingleAutocompleteChoiceType } from "../SingleAutocompleteSelectField";
import FormSpacer from "../FormSpacer";
import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import { IFilter, FieldType, FilterType } from "./types";
import Arrow from "./Arrow";
import { FilterReducerAction } from "./reducer";
import FilterAutocompleteField from "./FilterAutocompleteField";
import FilterOptionField from "./FilterOptionField";

export interface FilterContentProps<T extends string = string> {
  currencySymbol: string;
  filters: IFilter<T>;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<T>>;
  onClear: () => void;
  onSubmit: () => void;
}

const useStyles = makeStyles(
  theme => ({
    actionBar: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      padding: theme.spacing(1, 3)
    },
    andLabel: {
      margin: theme.spacing(0, 2)
    },
    arrow: {
      marginRight: theme.spacing(2)
    },
    clear: {
      marginRight: theme.spacing(1)
    },
    filterFieldBar: {
      "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.divider}`
      },
      padding: theme.spacing(1, 2.5)
    },
    filterSettings: {
      background: fade(theme.palette.primary.main, 0.2),
      padding: theme.spacing(2, 3)
    },
    input: {
      padding: "12px 0 9px 12px"
    },
    inputRange: {
      alignItems: "center",
      display: "flex"
    },
    label: {
      fontWeight: 600
    },
    option: {
      left: -theme.spacing(0.5),
      position: "relative"
    },
    optionRadio: {
      left: -theme.spacing(0.25)
    }
  }),
  { name: "FilterContent" }
);

function getIsFilterMultipleChoices(
  intl: IntlShape
): SingleAutocompleteChoiceType[] {
  return [
    {
      label: intl.formatMessage({
        defaultMessage: "equal to",
        description: "is filter range or value"
      }),
      value: FilterType.SINGULAR
    },
    {
      label: intl.formatMessage({
        defaultMessage: "between",
        description: "is filter range or value"
      }),
      value: FilterType.MULTIPLE
    }
  ];
}

const FilterContent: React.FC<FilterContentProps> = ({
  currencySymbol,
  filters,
  onClear,
  onFilterPropertyChange,
  onSubmit
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [
    autocompleteDisplayValues,
    setAutocompleteDisplayValues
  ] = useStateFromProps<Record<string, MultiAutocompleteChoiceType[]>>(
    filters.reduce((acc, filterField) => {
      if (filterField.type === FieldType.autocomplete) {
        acc[filterField.name] = filterField.displayValues;
      }

      return acc;
    }, {})
  );

  return (
    <Paper>
      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className={classes.actionBar}>
          <Typography className={classes.label}>
            <FormattedMessage defaultMessage="Filters" />
          </Typography>
          <div>
            <Button className={classes.clear} onClick={onClear}>
              <FormattedMessage {...buttonMessages.clear} />
            </Button>
            <Button color="primary" variant="contained" type="submit">
              <FormattedMessage {...buttonMessages.done} />
            </Button>
          </div>
        </div>
        <Hr />
        {filters
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map(filterField => (
            <React.Fragment key={filterField.name}>
              <div className={classes.filterFieldBar}>
                <FormControlLabel
                  control={<Checkbox checked={filterField.active} />}
                  label={filterField.label}
                  onChange={() =>
                    onFilterPropertyChange({
                      payload: {
                        name: filterField.name,
                        update: {
                          active: !filterField.active
                        }
                      },
                      type: "set-property"
                    })
                  }
                />
              </div>
              {filterField.active && (
                <div className={classes.filterSettings}>
                  {filterField.type === FieldType.text && (
                    <TextField
                      fullWidth
                      name={filterField.name}
                      InputProps={{
                        classes: {
                          input: classes.input
                        }
                      }}
                      value={filterField.value[0]}
                      onChange={event =>
                        onFilterPropertyChange({
                          payload: {
                            name: filterField.name,
                            update: {
                              value: [event.target.value, filterField.value[1]]
                            }
                          },
                          type: "set-property"
                        })
                      }
                    />
                  )}
                  {[FieldType.date, FieldType.price, FieldType.number].includes(
                    filterField.type
                  ) && (
                    <>
                      <SingleSelectField
                        choices={getIsFilterMultipleChoices(intl)}
                        value={
                          filterField.multiple
                            ? FilterType.MULTIPLE
                            : FilterType.SINGULAR
                        }
                        InputProps={{
                          classes: {
                            input: classes.input
                          }
                        }}
                        onChange={event =>
                          onFilterPropertyChange({
                            payload: {
                              name: filterField.name,
                              update: {
                                multiple:
                                  event.target.value === FilterType.MULTIPLE
                              }
                            },
                            type: "set-property"
                          })
                        }
                      />
                      <FormSpacer />
                      <div className={classes.inputRange}>
                        <div>
                          <Arrow className={classes.arrow} />
                        </div>
                        {filterField.multiple ? (
                          <>
                            <TextField
                              fullWidth
                              name={filterField.name + "_min"}
                              InputProps={{
                                classes: {
                                  input: classes.input
                                },
                                endAdornment:
                                  filterField.type === FieldType.price &&
                                  currencySymbol,
                                type:
                                  filterField.type === FieldType.date
                                    ? "date"
                                    : "number"
                              }}
                              value={filterField.value[0]}
                              onChange={event =>
                                onFilterPropertyChange({
                                  payload: {
                                    name: filterField.name,
                                    update: {
                                      value: [
                                        event.target.value,
                                        filterField.value[1]
                                      ]
                                    }
                                  },
                                  type: "set-property"
                                })
                              }
                            />
                            <span className={classes.andLabel}>
                              <FormattedMessage
                                defaultMessage="and"
                                description="filter range separator"
                              />
                            </span>
                            <TextField
                              fullWidth
                              name={filterField.name + "_max"}
                              InputProps={{
                                classes: {
                                  input: classes.input
                                },
                                endAdornment:
                                  filterField.type === FieldType.price &&
                                  currencySymbol,
                                type:
                                  filterField.type === FieldType.date
                                    ? "date"
                                    : "number"
                              }}
                              value={filterField.value[1]}
                              onChange={event =>
                                onFilterPropertyChange({
                                  payload: {
                                    name: filterField.name,
                                    update: {
                                      value: [
                                        filterField.value[0],
                                        event.target.value
                                      ]
                                    }
                                  },
                                  type: "set-property"
                                })
                              }
                            />
                          </>
                        ) : (
                          <TextField
                            fullWidth
                            name={filterField.name}
                            InputProps={{
                              classes: {
                                input: classes.input
                              },
                              endAdornment:
                                filterField.type === FieldType.price &&
                                currencySymbol,
                              type:
                                filterField.type === FieldType.date
                                  ? "date"
                                  : [
                                      FieldType.number,
                                      FieldType.price
                                    ].includes(filterField.type)
                                  ? "number"
                                  : "text"
                            }}
                            value={filterField.value[0]}
                            onChange={event =>
                              onFilterPropertyChange({
                                payload: {
                                  name: filterField.name,
                                  update: {
                                    value: [
                                      event.target.value,
                                      filterField.value[1]
                                    ]
                                  }
                                },
                                type: "set-property"
                              })
                            }
                          />
                        )}
                      </div>
                    </>
                  )}
                  {filterField.type === FieldType.options && (
                    <FilterOptionField
                      filterField={filterField}
                      onFilterPropertyChange={onFilterPropertyChange}
                    />
                  )}
                  {filterField.type === FieldType.boolean &&
                    filterField.options.map(option => (
                      <div
                        className={classNames(
                          classes.option,
                          classes.optionRadio
                        )}
                        key={option.value}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={filterField.value[0] === option.value}
                              color="primary"
                            />
                          }
                          label={option.label}
                          name={filterField.name}
                          onChange={() =>
                            onFilterPropertyChange({
                              payload: {
                                name: filterField.name,
                                update: {
                                  value: [option.value]
                                }
                              },
                              type: "set-property"
                            })
                          }
                        />
                      </div>
                    ))}
                  {filterField.type === FieldType.autocomplete &&
                    filterField.multiple && (
                      <FilterAutocompleteField
                        displayValues={autocompleteDisplayValues}
                        filterField={filterField}
                        setDisplayValues={setAutocompleteDisplayValues}
                        onFilterPropertyChange={onFilterPropertyChange}
                      />
                    )}
                </div>
              )}
            </React.Fragment>
          ))}
      </form>
    </Paper>
  );
};
FilterContent.displayName = "FilterContent";
export default FilterContent;
