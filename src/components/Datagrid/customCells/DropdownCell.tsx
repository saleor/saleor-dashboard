import { Combobox } from "@dashboard/components/Combobox";
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import { Option } from "@saleor/macaw-ui-next";
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

  const getChoices = React.useCallback(
    async (text: string) => {
      setData((await cell.data?.update?.(text)) ?? []);
    },
    [cell.data],
  );

  const userProps = pick(cell.data, ["allowCustomValues", "emptyOption"]);
  const props = cell.data.update
    ? { fetchOnFocus: true, fetchChoices: getChoices, choices: data }
    : {
        fetchOnFocus: false,
        fetchChoices: () => Promise.resolve([]),
        choices: cell.data.choices,
      };

  return (
    <Combobox
      allowCustomValues={userProps.allowCustomValues}
      alwaysFetchOnFocus={props.fetchOnFocus}
      allowEmptyValue={userProps.emptyOption}
      fetchMore={{
        hasMore: false,
        loading: false,
        onFetchMore: () => undefined,
      }}
      options={props.choices ?? []}
      value={cell.data.value}
      fetchOptions={props.fetchChoices}
      loading={false}
      name=""
      onChange={event => {
        return onFinishedEditing({
          ...cell,
          data: {
            ...cell.data,
            value: props.choices?.find(c => c.value === event.target.value) ?? {
              label: event.target.value ?? "",
              value: event.target.value ?? "",
            },
          },
        });
      }}
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
