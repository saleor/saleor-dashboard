import { DatagridSwatchPreview } from "@dashboard/components/Attributes/DatagridSwatchPreview";
import { type AttributeSwatchData } from "@dashboard/components/Attributes/getAttributeSwatchData";
import {
  type CustomCell,
  type CustomRenderer,
  type DrawArgs,
  getMiddleCenterBias,
  GridCellKind,
  type ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useCallback, useState } from "react";

type DropdownCellGetSuggestionsFn = (text: string) => Promise<Option[]>;

export type AttributeSearchOption = Option & {
  swatch?: AttributeSwatchData;
};

export interface DropdownCellProps {
  readonly choices?: Option[];
  readonly update?: DropdownCellGetSuggestionsFn;
  readonly kind: "dropdown-cell";
  readonly value: Option | null;
  readonly allowCustomValues?: boolean;
  readonly emptyOption?: boolean;
  readonly swatch?: AttributeSwatchData;
}

export type DropdownCell = CustomCell<DropdownCellProps>;

export const emptyDropdownCellValue: Option = {
  label: "",
  value: "",
};

const SWATCH_SIZE = 14;
const SWATCH_TEXT_GAP = 6;

const getOptionSwatch = (option: Option | null | undefined): AttributeSwatchData | undefined =>
  (option as AttributeSearchOption | null | undefined)?.swatch;

const DropdownCellEdit: ReturnType<ProvideEditorCallback<DropdownCell>> = ({
  value: cell,
  onFinishedEditing,
}) => {
  const [data, setData] = useState<Option[]>([]);

  const getChoices = useCallback(
    async (text: string) => {
      setData((await cell.data?.update?.(text)) ?? []);
    },
    [cell.data],
  );

  const props = cell.data.update
    ? { fetchOnFocus: true, fetchChoices: getChoices, choices: data }
    : { fetchOnFocus: false, fetchChoices: () => Promise.resolve([]), choices: cell.data.choices };

  const selectedSwatch = cell.data.swatch ?? getOptionSwatch(cell.data.value);

  return (
    <DynamicCombobox
      options={props.choices ?? []}
      value={cell.data.value}
      onFocus={() => props.fetchChoices("")}
      loading={false}
      name=""
      startAdornment={() => (selectedSwatch ? <DatagridSwatchPreview {...selectedSwatch} /> : null)}
      /**
       * There is a bug - looks like it's properly changing with keyobard, but mouse event is somehow not passed
       * to the dropdown layer @fixme
       */
      onChange={option => {
        const matchedOption =
          props.choices?.find(choice => choice.value === option?.value) ??
          ({
            label: option?.label ?? "",
            value: option?.value ?? "",
          } satisfies Option);

        return onFinishedEditing({
          ...cell,
          data: {
            ...cell.data,
            value: matchedOption,
            swatch: getOptionSwatch(matchedOption),
          },
        });
      }}
    />
  );
};

const drawSwatch = (
  args: DrawArgs<DropdownCell>,
  x: number,
  y: number,
  swatch: AttributeSwatchData,
) => {
  const { ctx, theme, imageLoader, col, row } = args;
  const radius = SWATCH_SIZE / 2;
  const centerX = x + radius;
  const centerY = y + radius;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  if (swatch.fileUrl) {
    const imageResult = imageLoader.loadOrGetImage(swatch.fileUrl, col, row);

    if (imageResult) {
      ctx.drawImage(imageResult, x, y, SWATCH_SIZE, SWATCH_SIZE);
    } else {
      ctx.fillStyle = theme.borderColor;
      ctx.fill();
    }
  } else if (swatch.colorValue) {
    ctx.fillStyle = swatch.colorValue;
    ctx.fill();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();
};

export const dropdownCellRenderer: CustomRenderer<DropdownCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is DropdownCell => (c.data as any).kind === "dropdown-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value, swatch } = cell.data;
    const cellSwatch = swatch ?? getOptionSwatch(value);
    const textX = cellSwatch ? rect.x + 8 + SWATCH_SIZE + SWATCH_TEXT_GAP : rect.x + 8;

    if (cellSwatch) {
      const swatchY = rect.y + (rect.height - SWATCH_SIZE) / 2;

      drawSwatch(args, rect.x + 8, swatchY, cellSwatch);
    }

    ctx.fillStyle = theme.textDark;
    ctx.fillText(
      value?.label ?? "",
      textX,
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
        swatch: undefined,
      },
    }),
  }),
  onPaste: (value, data) => ({
    ...data,
    value: value ? { value, label: value } : null,
    swatch: undefined,
  }),
};
