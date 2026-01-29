import useDebounce from "@dashboard/hooks/useDebounce";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
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
  const debouncedFetch = useDebounce(onQueryChange, 500);

  return (
    <Controller
      name="linkValue"
      control={control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
        const subOptionsListValue = options?.find(o => o.value === value);

        return (
          <DynamicCombobox
            {...field}
            disabled={disabled}
            label={intl.formatMessage({
              id: "WDrC7e",
              defaultMessage: "Link value",
              description: "label",
            })}
            options={options ?? []}
            onChange={(option: Option | null) => {
              onChange({ target: { name: "linkValue", value: option?.value ?? "" } });
            }}
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
            onInputValueChange={debouncedFetch}
            onFocus={() => onQueryChange("")}
            onScrollEnd={() => {
              if (fetchMoreProps?.hasMore) {
                fetchMoreProps.onFetchMore();
              }
            }}
            loading={loading || fetchMoreProps?.loading || fetchMoreProps?.hasMore}
            locale={{
              loadingText: intl.formatMessage(commonMessages.loading),
            }}
            data-test-id="menu-item-link-value-input"
            size="small"
          />
        );
      }}
    />
  );
};
