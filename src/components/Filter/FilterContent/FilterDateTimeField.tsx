import { TextField } from "@material-ui/core";
import { FieldType, FilterFieldBaseProps } from "@saleor/components/Filter";
import Arrow from "@saleor/components/Filter/Arrow";
import { splitDateTime } from "@saleor/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
  filterTestingContext,
  getDateFilterValue,
  getDateTimeFilterValue,
  useCommonStyles,
} from "./utils";

type FilterDateTimeFieldProps = FilterFieldBaseProps<
  string,
  FieldType.dateTime | FieldType.date
>;

export const FilterDateTimeField: React.FC<FilterDateTimeFieldProps> = ({
  filter,
  onFilterPropertyChange,
}) => {
  const classes = useCommonStyles({});
  const isDateTime = filter.type === FieldType.dateTime;
  const isMultiple = filter.multiple;

  const handleChange = (value: string[]) =>
    onFilterPropertyChange({
      payload: {
        name: filter.name,
        update: {
          value,
        },
      },
      type: "set-property",
    });

  return (
    <>
      <div className={classes.inputRange}>
        <div>
          <Arrow className={classes.arrow} />
        </div>
        <TextField
          {...(isMultiple && { "data-test-range-type": "min" })}
          data-test-id={filterTestingContext + filter.name}
          fullWidth
          name={filter.name + (isMultiple ? "_min" : "")}
          InputProps={{
            classes: {
              input: classes.input,
            },
            type: "date",
          }}
          value={splitDateTime(filter.value[0]).date}
          onChange={event => {
            const value = getDateFilterValue(
              event.target.value,
              filter.value[0],
              isDateTime,
            );
            handleChange(isMultiple ? [value, filter.value[1]] : [value]);
          }}
        />
        {isDateTime && (
          <TextField
            data-test-id={filterTestingContext + filter.name}
            data-test-range-type="time_min"
            className={classes.inputTime}
            name={filter.name + (isMultiple ? "_time_min" : "")}
            InputProps={{
              classes: { input: classes.input },
              type: "time",
            }}
            value={splitDateTime(filter.value[0]).time}
            onChange={event => {
              const value = getDateTimeFilterValue(
                filter.value[0],
                event.target.value,
              );
              handleChange(isMultiple ? [value, filter.value[1]] : [value]);
            }}
          />
        )}
      </div>
      {filter.multiple && (
        <>
          <div className={classes.inputRange}>
            <div className={classes.spacer} />
            <span className={classes.andLabel}>
              <FormattedMessage
                id="34F7Jk"
                defaultMessage="and"
                description="filter range separator"
              />
            </span>
          </div>
          <div className={classes.inputRange}>
            <div className={classes.spacer} />
            <TextField
              data-test-id={filterTestingContext + filter.name}
              data-test-range-type="max"
              fullWidth
              name={filter.name + "_max"}
              InputProps={{
                classes: {
                  input: classes.input,
                },
                type: "date",
              }}
              value={splitDateTime(filter.value[1]).date}
              onChange={event =>
                handleChange([
                  filter.value[0],
                  getDateFilterValue(
                    event.target.value,
                    filter.value[1],
                    isDateTime,
                  ),
                ])
              }
            />
            {isDateTime && (
              <TextField
                data-test-id={filterTestingContext + filter.name}
                className={classes.inputTime}
                data-test-range-type="time_max"
                name={filter.name + "_time_max"}
                InputProps={{
                  classes: { input: classes.input },
                  type: "time",
                }}
                value={splitDateTime(filter.value[1]).time}
                onChange={event =>
                  handleChange([
                    filter.value[0],
                    getDateTimeFilterValue(filter.value[1], event.target.value),
                  ])
                }
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
