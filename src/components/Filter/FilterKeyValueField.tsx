import { TextField } from "@material-ui/core";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { keyValueMessages } from "./messages";
import { FilterBaseFieldProps, IFilterElement } from "./types";

export interface KeyValueField {
  key: string;
  value?: string;
}

export type FilterKeyValueFieldProps = FilterBaseFieldProps<KeyValueField>;

const useStyles = makeStyles(
  theme => ({
    metadataField: {
      display: "flex",
      alignItems: "space-between",
      gap: theme.spacing(0.5)
    },
    fieldsWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.5),
      marginBottom: theme.spacing(1)
    },
    formWrapper: {
      display: "flex",
      flexDirection: "column"
    },
    addButton: {
      alignSelf: "flex-end"
    }
  }),
  { name: "FilterKeyValueField" }
);

const getUpdateArrayFn = <T,>(key: "key" | "value") => (
  array: T[],
  index: number,
  value: string
) => {
  const item = array[index];
  return [
    ...array.slice(0, index),
    { ...item, [key]: value },
    ...array.slice(index + 1)
  ];
};

const updateKeyFn = getUpdateArrayFn<KeyValueField>("key");
const updateValueFn = getUpdateArrayFn<KeyValueField>("value");
const createEmptyPair = (array: KeyValueField[]) => [...array, { key: "" }];

export const FilterKeyValueField = ({
  filterField,
  onFilterPropertyChange
}: FilterKeyValueFieldProps) => {
  const intl = useIntl();
  const classes = useStyles();

  const values = filterField.value?.length
    ? filterField.value
    : ([{ key: "" }] as KeyValueField[]);

  return (
    <div className={classes.formWrapper}>
      <div className={classes.fieldsWrapper}>
        {values.map((innerField, index) => (
          <div className={classes.metadataField}>
            <TextField
              fullWidth
              name={filterField.name}
              label={intl.formatMessage(keyValueMessages.key)}
              value={innerField.key}
              onChange={event =>
                onFilterPropertyChange({
                  payload: {
                    name: filterField.name,
                    update: {
                      value: updateKeyFn(values, index, event.target.value)
                    }
                  },
                  type: "set-property"
                })
              }
            />
            <TextField
              fullWidth
              name={filterField.name}
              label={intl.formatMessage(keyValueMessages.value)}
              value={innerField.value ?? ""}
              onChange={event =>
                onFilterPropertyChange({
                  payload: {
                    name: filterField.name,
                    update: {
                      value: updateValueFn(values, index, event.target.value)
                    }
                  },
                  type: "set-property"
                })
              }
            />
          </div>
        ))}
      </div>
      <Button
        className={classes.addButton}
        color="primary"
        onClick={() => {
          onFilterPropertyChange({
            payload: {
              name: filterField.name,
              update: {
                value: createEmptyPair(values)
              }
            },
            type: "set-property"
          });
        }}
      >
        {intl.formatMessage(keyValueMessages.add)}
      </Button>
    </div>
  );
};
