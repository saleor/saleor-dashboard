import {
  CustomCell,
  CustomCellRenderer,
  getMiddleCenterBias,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import SingleAutocompleteSelectField from "../SingleAutocompleteSelectField";
import { Choice } from "../SingleSelectField";

export type DropdownChoice = Choice<string, string>;

interface DropdownCellProps {
  readonly choices?: DropdownChoice[];
  readonly update?: (text: string) => Promise<DropdownChoice[]>;
  readonly kind: "dropdown-cell";
  readonly value: Choice | null;
}

export type DropdownCell = CustomCell<DropdownCellProps>;

const useDropdownCellStyles = makeStyles(
  theme => ({
    input: {
      ...theme.typography.body1,
      appearance: "none",
      background: "none",
      border: "none",
      padding: theme.spacing(1.5, 1),
      outline: 0,
      textAlign: "right",
    },
  }),
  { name: "DropdownCell" },
);

const DropdownCellEdit: ReturnType<ProvideEditorCallback<DropdownCell>> = ({
  value: cell,
  onFinishedEditing,
}) => {
  const classes = useDropdownCellStyles();

  const [data, setData] = React.useState<DropdownChoice[]>([]);
  const getChoices = React.useCallback(async (text: string) => {
    setData(await cell.data.update(text));
  }, []);

  const props = cell.data.update
    ? { fetchOnFocus: true, fetchChoices: getChoices, choices: data }
    : { choices: cell.data.choices };

  return (
    <SingleAutocompleteSelectField
      {...props}
      nakedInput
      onChange={event =>
        onFinishedEditing({
          ...cell,
          data: {
            ...cell.data,
            value: props.choices.find(c => c.value === event.target.value),
          },
        })
      }
      name=""
      displayValue={cell.data.value.label.toString()}
      value={cell.data.value.value}
    />
  );
};

export const dropdownCellRenderer: CustomCellRenderer<DropdownCell> = {
  isMatch: (c): c is DropdownCell => (c.data as any).kind === "dropdown-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;

    ctx.fillStyle = theme.textDark;
    ctx.textAlign = "right";
    ctx.fillText(
      value.label.toString(),
      rect.x + rect.width - 8,
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
