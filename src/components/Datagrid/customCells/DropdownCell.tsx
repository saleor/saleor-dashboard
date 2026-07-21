import {
  DATAGRID_SWATCH_SIZE,
  DatagridSwatchPreview,
} from "@dashboard/components/Attributes/DatagridSwatchPreview";
import { type AttributeSwatchData } from "@dashboard/components/Attributes/getAttributeSwatchData";
import useDebounce from "@dashboard/hooks/useDebounce";
import {
  type CustomCell,
  type CustomRenderer,
  type DrawArgs,
  getMiddleCenterBias,
  GridCellKind,
  type ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useCallback, useRef, useState } from "react";

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

/** Ensures Macaw sets data-portal-for so Glide isOutsideClick can keep the list open. */
const DROPDOWN_CELL_COMBOBOX_ID = "datagrid-dropdown-cell";

const SWATCH_SIZE = DATAGRID_SWATCH_SIZE;
const SWATCH_TEXT_GAP = 8;

const getOptionSwatch = (option: Option | null | undefined): AttributeSwatchData | undefined =>
  (option as AttributeSearchOption | null | undefined)?.swatch;

const toStoredOption = (
  option: Option | null | undefined,
  swatch?: AttributeSwatchData,
): AttributeSearchOption => ({
  label: option?.label ?? "",
  value: option?.value ?? "",
  ...(swatch ? { swatch } : {}),
});

const DropdownCellEdit: ReturnType<ProvideEditorCallback<DropdownCell>> = ({
  value: cell,
  onFinishedEditing,
}) => {
  const [data, setData] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchRequestId = useRef(0);

  const getChoices = useCallback(
    async (text: string) => {
      if (!cell.data?.update) {
        return;
      }

      const requestId = ++fetchRequestId.current;

      setLoading(true);

      try {
        const nextOptions = (await cell.data.update(text)) ?? [];

        if (requestId === fetchRequestId.current) {
          setData(nextOptions);
        }
      } finally {
        if (requestId === fetchRequestId.current) {
          setLoading(false);
        }
      }
    },
    [cell.data],
  );

  const debouncedGetChoices = useDebounce((text: string) => {
    void getChoices(text);
  }, 500);

  const choices = cell.data.update ? data : (cell.data.choices ?? []);
  const selectedSwatch = cell.data.swatch ?? getOptionSwatch(cell.data.value);

  return (
    <DynamicCombobox
      id={DROPDOWN_CELL_COMBOBOX_ID}
      options={choices}
      value={cell.data.value}
      onFocus={() => {
        if (cell.data.update) {
          void getChoices("");
        }
      }}
      onInputValueChange={value => {
        if (cell.data.update) {
          // Show Macaw's list throbber immediately; fetch after debounce.
          setLoading(true);
          debouncedGetChoices(value);
        }
      }}
      loading={loading}
      name=""
      startAdornment={() =>
        selectedSwatch ? <DatagridSwatchPreview {...selectedSwatch} placement="input" /> : null
      }
      onChange={option => {
        const matchedOption = choices.find(choice => choice.value === option?.value) ?? option;
        const swatch = getOptionSwatch(matchedOption);
        const storedOption = toStoredOption(matchedOption, swatch);

        return onFinishedEditing({
          ...cell,
          copyData: storedOption.label,
          data: {
            ...cell.data,
            value: storedOption,
            swatch,
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
