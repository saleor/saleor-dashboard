import { Combobox } from "@dashboard/components/Combobox";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { useIntl } from "react-intl";

import { MenuItemDialogFormData, MenuItemTypeWithOptions } from "../types";
import { useLinkValue } from "./useLinkValue";

interface MenuItemDialogLinkValueProps {
  linkType: MenuItemTypeWithOptions;
  control: Control<MenuItemDialogFormData, any>;
  disabled: boolean;
  showInitialValue?: boolean;
  initialDisplayValue?: string;
}

export const MenuItemDialogLinkValue = ({
  linkType,
  disabled,
  control,
  showInitialValue,
  initialDisplayValue,
}: MenuItemDialogLinkValueProps) => {
  const intl = useIntl();
  const { fetchMoreProps, loading, options, onQueryChange } = useLinkValue(linkType);

  return (
    <Controller
      name="linkValue"
      control={control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
        const subOptionsListValue = options?.find(o => o.value === value);

        return (
          <Combobox
            {...field}
            disabled={disabled}
            label={intl.formatMessage({
              id: "WDrC7e",
              defaultMessage: "Link value",
              description: "label",
            })}
            options={options ?? []}
            onChange={onChange}
            value={
              // Show initial value with label in case initial options list from API does not contain it
              showInitialValue
                ? {
                    value,
                    label: initialDisplayValue!,
                  }
                : subOptionsListValue || null
            }
            name="linkValue"
            error={!!error}
            helperText={error?.message}
            fetchOptions={onQueryChange}
            fetchMore={fetchMoreProps}
            loading={loading}
            data-test-id="menu-item-link-value-input"
          />
        );
      }}
    />
  );
};
