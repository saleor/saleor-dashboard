import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import pick from "lodash/pick";
import React from "react";

export type DropdownCellGetSuggestionsFn = (text: string) => Promise<Option[]>;
export interface DropdownCellProps {
  readonly choices?: Option[];
  readonly update?: DropdownCellGetSuggestionsFn;
  readonly kind: "dropdown-cell";
  readonly value: Option | null;
  readonly allowCustomValues?: boolean;
  readonly emptyOption?: boolean;
}

export type DropdownCell = CustomCell<DropdownCellProps>;

export const emptyDropdownCellValue: Option = {
  label: "",
  value: "",
};

const DropdownCellEdit: ReturnType<ProvideEditorCallback<DropdownCell>> = ({
  value: cell,
  onFinishedEditing,
}) => {
  const [data, setData] = React.useState<Option[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const mounted = React.useRef(false);

  const getChoices = React.useCallback(
    async (text: string) => {
      setData((await cell.data?.update?.(text)) ?? []);
    },
    [cell.data],
  );

  const userProps = pick(cell.data, ["allowCustomValues", "emptyOption"]);
  const props = cell.data.update
    ? { fetchOnFocus: true, fetchChoices: getChoices, choices: data }
    : { fetchOnFocus: false, fetchChoices: () => Promise.resolve([]), choices: cell.data.choices };

  // Build options with custom value support and empty option
  const buildOptions = () => {
    let options = props.choices ?? [];

    // Add empty option if allowed
    if (userProps.emptyOption) {
      options = [{ label: "", value: "" }, ...options];
    }

    // Add custom value option if allowed and input doesn't match existing
    if (userProps.allowCustomValues && inputValue.trim()) {
      const hasExactMatch = options.some(
        opt => opt.label.toLowerCase() === inputValue.trim().toLowerCase(),
      );

      if (!hasExactMatch) {
        options = [{ label: `Add: ${inputValue}`, value: inputValue }, ...options];
      }
    }

    return options;
  };

  return (
    <DynamicCombobox
      options={buildOptions()}
      value={cell.data.value}
      loading={false}
      name=""
      onChange={(option: Option | null) => {
        return onFinishedEditing({
          ...cell,
          data: {
            ...cell.data,
            value: option ? option : { label: "", value: "" },
          },
        });
      }}
      onInputValueChange={value => {
        setInputValue(value);
        props.fetchChoices(value);
      }}
      onFocus={() => {
        if (props.fetchOnFocus && !mounted.current) {
          mounted.current = true;
          props.fetchChoices("");
        }
      }}
      size="small"
    />
  );
};

export const dropdownCellRenderer: CustomRenderer<DropdownCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is DropdownCell => (c.data as any).kind === "dropdown-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;

    ctx.fillStyle = theme.textDark;
    ctx.fillText(
      value?.label ?? "",
      rect.x + 8,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );

    return true;
  },
  provideEditor: () => ({
    editor: DropdownCellEdit,
    disablePadding: true,
    deletedValue: cell => ({
      ...cell,
      copyData: "",
      data: {
        ...cell.data,
        display: "",
        value: null,
      },
    }),
  }),
  onPaste: (value, data) => ({
    ...data,
    value: { value, label: value } ?? null,
  }),
};
