import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { KeyValue } from "@dashboard/types";
import { TextField } from "@material-ui/core";
import { Button, IconButton } from "@saleor/macaw-ui";
import { Trash2 } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./FilterKeyValueField.module.css";
import { keyValueMessages } from "./messages";
import { FieldType, FilterFieldBaseProps } from "./types";

// @eslint-ignore-next-line
const getUpdateArrayFn =
  <T,>(key: "key" | "value") =>
  (array: T[], index: number, value: string) => {
    const item = array[index];

    return [...array.slice(0, index), { ...item, [key]: value }, ...array.slice(index + 1)];
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
  const values = filter.value?.length ? filter.value : ([{ key: "" }] as KeyValue[]);

  return (
    <div className={styles.formWrapper}>
      <div className={styles.fieldsWrapper}>
        {values.map((innerField, index) => (
          <div className={styles.metadataField} key={`${innerField.key}-${index}`}>
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
              className={styles.deleteButton}
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
              <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
            </IconButton>
          </div>
        ))}
      </div>
      <Button
        className={styles.addButton}
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
