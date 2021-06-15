import { FormControlLabel, Radio, TextField } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import FormSpacer from "@saleor/components/FormSpacer";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Arrow from "../Arrow";
import FilterAutocompleteField, {
  FilterAutocompleteDisplayValues
} from "../FilterAutocompleteField";
import FilterOptionField from "../FilterOptionField";
import { FilterReducerAction } from "../reducer";
import { FieldType, FilterType, IFilterElement } from "../types";
import { getIsFilterMultipleChoices } from "./utils";

const useStyles = makeStyles(
  theme => ({
    andLabel: {
      margin: theme.spacing(0, 2)
    },
    arrow: {
      marginRight: theme.spacing(2)
    },
    filterSettings: {
      background: fade(theme.palette.primary.main, 0.1),
      padding: theme.spacing(2, 3)
    },
    input: {
      padding: "12px 0 9px 12px"
    },
    inputRange: {
      alignItems: "center",
      display: "flex"
    },

    option: {
      left: -theme.spacing(0.5),
      position: "relative"
    },
    optionRadio: {
      left: -theme.spacing(0.25)
    }
  }),
  { name: "FilterContentBody" }
);

const filterTestingContext = "filter-field";

export interface FilterContentBodyProps<T extends string = string> {
  children?: React.ReactNode;
  filter: IFilterElement<T>;
  currencySymbol?: string;
  initialAutocompleteDisplayValues: FilterAutocompleteDisplayValues;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<T>>;
  autocompleteDisplayValues: FilterAutocompleteDisplayValues;
  setAutocompleteDisplayValues: React.Dispatch<
    React.SetStateAction<Record<string, MultiAutocompleteChoiceType[]>>
  >;
}

const FilterContentBody: React.FC<FilterContentBodyProps> = ({
  filter,
  children,
  currencySymbol,
  onFilterPropertyChange,
  autocompleteDisplayValues,
  setAutocompleteDisplayValues,
  initialAutocompleteDisplayValues
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.filterSettings}>
      {children}
      {filter.type === FieldType.text && (
        <TextField
          data-test={filterTestingContext}
          data-test-id={filter.name}
          fullWidth
          name={filter.name}
          InputProps={{
            classes: {
              input: classes.input
            }
          }}
          value={filter.value[0]}
          onChange={event =>
            onFilterPropertyChange({
              payload: {
                name: filter.name,
                update: {
                  value: [event.target.value, filter.value[1]]
                }
              },
              type: "set-property"
            })
          }
        />
      )}
      {[FieldType.date, FieldType.price, FieldType.number].includes(
        filter.type
      ) && (
        <>
          <SingleSelectField
            data-test="filterRangeTypeChoice"
            choices={getIsFilterMultipleChoices(intl)}
            value={filter.multiple ? FilterType.MULTIPLE : FilterType.SINGULAR}
            InputProps={{
              classes: {
                input: classes.input
              }
            }}
            onChange={event =>
              onFilterPropertyChange({
                payload: {
                  name: filter.name,
                  update: {
                    multiple: event.target.value === FilterType.MULTIPLE
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
            {filter.multiple ? (
              <>
                <TextField
                  data-test={filterTestingContext}
                  data-test-id={filter.name}
                  data-test-range-type="min"
                  fullWidth
                  name={filter.name + "_min"}
                  InputProps={{
                    classes: {
                      input: classes.input
                    },
                    endAdornment:
                      filter.type === FieldType.price && currencySymbol,
                    type: filter.type === FieldType.date ? "date" : "number"
                  }}
                  value={filter.value[0]}
                  onChange={event =>
                    onFilterPropertyChange({
                      payload: {
                        name: filter.name,
                        update: {
                          value: [event.target.value, filter.value[1]]
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
                  data-test={filterTestingContext}
                  data-test-id={filter.name}
                  data-test-range-type="max"
                  fullWidth
                  name={filter.name + "_max"}
                  InputProps={{
                    classes: {
                      input: classes.input
                    },
                    endAdornment:
                      filter.type === FieldType.price && currencySymbol,
                    type: filter.type === FieldType.date ? "date" : "number"
                  }}
                  value={filter.value[1]}
                  onChange={event =>
                    onFilterPropertyChange({
                      payload: {
                        name: filter.name,
                        update: {
                          value: [filter.value[0], event.target.value]
                        }
                      },
                      type: "set-property"
                    })
                  }
                />
              </>
            ) : (
              <TextField
                data-test={filterTestingContext}
                data-test-id={filter.name}
                fullWidth
                name={filter.name}
                InputProps={{
                  classes: {
                    input: classes.input
                  },
                  endAdornment:
                    filter.type === FieldType.price && currencySymbol,
                  type:
                    filter.type === FieldType.date
                      ? "date"
                      : [FieldType.number, FieldType.price].includes(
                          filter.type
                        )
                      ? "number"
                      : "text"
                }}
                value={filter.value[0]}
                onChange={event =>
                  onFilterPropertyChange({
                    payload: {
                      name: filter.name,
                      update: {
                        value: [event.target.value, filter.value[1]]
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
      {filter.type === FieldType.options && (
        <FilterOptionField
          data-test={filterTestingContext}
          data-test-id={filter.name}
          filterField={filter}
          onFilterPropertyChange={onFilterPropertyChange}
        />
      )}
      {filter.type === FieldType.boolean &&
        filter.options.map(option => (
          <div
            className={classNames(classes.option, classes.optionRadio)}
            key={option.value}
          >
            <FormControlLabel
              control={
                <Radio
                  data-test="filterBoolean"
                  data-test-is-checked={filter.value[0] === option.value}
                  checked={filter.value[0] === option.value}
                  color="primary"
                />
              }
              label={option.label}
              name={filter.name}
              onChange={() =>
                onFilterPropertyChange({
                  payload: {
                    name: filter.name,
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
      {filter.type === FieldType.autocomplete && filter.multiple && (
        <FilterAutocompleteField
          data-test={filterTestingContext}
          data-test-id={filter.name}
          displayValues={autocompleteDisplayValues}
          filterField={filter}
          setDisplayValues={setAutocompleteDisplayValues}
          onFilterPropertyChange={onFilterPropertyChange}
          initialDisplayValues={initialAutocompleteDisplayValues}
        />
      )}
    </div>
  );
};

export default FilterContentBody;
