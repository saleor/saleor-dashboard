import { ChangeEvent } from "@dashboard/hooks/useForm";
import {
  Option,
  Select as SelectComponent,
  SelectProps as SelectComponentProps,
} from "@saleor/macaw-ui-next";
import React from "react";

export interface SelectProps<T, V> extends Omit<SelectComponentProps<T, V>, "onChange"> {
  onChange: (event: ChangeEvent) => void;
}

export const Select = <T extends Option, V extends Option | string>({
  onChange,
  ...props
}: SelectProps<T, V>) => {
  const handleOnChange = (value: V) => {
    onChange({
      target: {
        value: typeof value === "string" ? value : (value as Option)?.value,
        name: props.name ?? "",
      },
    });
  };

  return <SelectComponent {...props} onChange={handleOnChange} />;
};
