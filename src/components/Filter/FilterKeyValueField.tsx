import { TextField } from "@material-ui/core";
import { Button, DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { KeyValue } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { keyValueMessages } from "./messages";
import { FieldType, FilterFieldBaseProps } from "./types";

const useStyles = makeStyles(
  theme => ({
    metadataField: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    fieldsWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.5),
      marginBottom: theme.spacing(1),
    },
    formWrapper: {
      display: "flex",
      flexDirection: "column",
    },
    addButton: {
      alignSelf: "flex-end",
    },
    deleteButton: {
      marginLeft: "0.25rem",
      marginRight: "-0.75rem",
    },
  }),
  { name: "FilterKeyValueField" },
);

const getUpdateArrayFn = <T,>(key: "key" | "value") => (
  array: T[],
  index: number,
  value: string,
) => {
  const item = array[index];
  return [
    ...array.slice(0, index),
    { ...item, [key]: value },
    ...array.slice(index + 1),
  ];
};

const updateKeyFn = getUpdateArrayFn<KeyValue>("key");
const updateValueFn = getUpdateArrayFn<KeyValue>("value");
const createEmptyPair = (array: KeyValue[]) => [...array, { key: "" }];

type FilterKeyValueFieldProps<K extends string = string> = FilterFieldBaseProps<
  K,
  FieldType.keyValue
>;

export const FilterKeyValueField = <K extends string = string>({
  filter,
  onFilterPropertyChange,
}: FilterKeyValueFieldProps<K>) => {
  const intl = useIntl();
  const classes = useStyles();

  const values = filter.value?.length
    ? filter.value
    : ([{ key: "" }] as KeyValue[]);

  return (
    <div className={classes.formWrapper}>
      <div className={classes.fieldsWrapper}>
        {values.map((innerField, index) => (
          <div className={classes.metadataField}>
            <TextField
              fullWidth
              name={filter.name}
              label={intl.formatMessage(keyValueMessages.key)}
              value={innerField.key}
              onChange={event =>
                onFilterPropertyChange({
                  payload: {
                    name: filter.name,
                    update: {
                      value: updateKeyFn(values, index, event.target.value),
                    },
                  },
                  type: "set-property",
                })
              }
            />
            <TextField
              fullWidth
              name={filter.name}
              label={intl.formatMessage(keyValueMessages.value)}
              value={innerField.value ?? ""}
              onChange={event =>
                onFilterPropertyChange({
                  payload: {
                    name: filter.name,
                    update: {
                      value: updateValueFn(values, index, event.target.value),
                    },
                  },
                  type: "set-property",
                })
              }
            />
            <IconButton
              variant="secondary"
              className={classes.deleteButton}
              onClick={() => {
                onFilterPropertyChange({
                  payload: {
                    name: filter.name,
                    update: {
                      value: values.filter((_, i) => i !== index),
                    },
                  },
                  type: "set-property",
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
      <Button
        className={classes.addButton}
        color="primary"
        onClick={() => {
          onFilterPropertyChange({
            payload: {
              name: filter.name,
              update: {
                value: createEmptyPair(values),
              },
            },
            type: "set-property",
          });
        }}
      >
        {intl.formatMessage(keyValueMessages.add)}
      </Button>
    </div>
  );
};
