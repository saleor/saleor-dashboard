// @ts-strict-ignore
import { Combobox } from "@dashboard/components/Combobox";
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import pick from "lodash/pick";
import React from "react";

import { SingleAutocompleteSelectFieldProps } from "../../SingleAutocompleteSelectField";
import { Choice } from "../../SingleSelectField";

export type DropdownChoice = Choice<string, string>;
export type DropdownCellContentProps = Pick<
  SingleAutocompleteSelectFieldProps,
  "allowCustomValues" | "emptyOption"
>;

export type DropdownCellGetSuggestionsFn = (text: string) => Promise<DropdownChoice[]>;
interface DropdownCellProps extends DropdownCellContentProps {
  readonly choices?: DropdownChoice[];
  readonly update?: DropdownCellGetSuggestionsFn;
  readonly kind: "dropdown-cell";
  readonly value: DropdownChoice | null;
}

export type DropdownCell = CustomCell<DropdownCellProps>;

export const emptyDropdownCellValue: DropdownChoice = {
  label: "",
  value: null,
};

const DropdownCellEdit: ReturnType<ProvideEditorCallback<DropdownCell>> = ({
  value: cell,
  onFinishedEditing,
}) => {
  const [data, setData] = React.useState<DropdownChoice[]>([]);
  const getChoices = React.useCallback(
    async (text: string) => {
      setData(await cell.data.update(text));
    },
    [cell.data],
  );
  const userProps = pick(cell.data, ["allowCustomValues", "emptyOption"]);
  const props = cell.data.update
    ? { fetchOnFocus: true, fetchChoices: getChoices, choices: data }
    : { choices: cell.data.choices };

  return (
    <Combobox
      allowCustomValues={userProps.allowCustomValues}
      alwaysFetchOnFocus={cell.data.update ? true : false}
      allowEmptyValue={userProps.emptyOption}
      fetchMore={{
        hasMore: false,
        loading: false,
        onFetchMore: () => undefined,
      }}
      options={cell.data.update ? data : cell.data.choices}
      value={{
        label: cell.data.value.label,
        value: cell.data.value.value,
      }}
      fetchOptions={cell.data.update ? getChoices : undefined}
      loading={false}
      name=""
      onChange={event =>
        onFinishedEditing({
          ...cell,
          data: {
            ...cell.data,
            value: props.choices.find(c => c.value === event.target.value) ?? {
              label: event.target.value,
              value: event.target.value,
            },
          },
        })
      }
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
      value.label,
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
