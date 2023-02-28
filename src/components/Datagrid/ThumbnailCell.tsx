import {
  CustomCell,
  CustomCellRenderer,
  getMiddleCenterBias,
  TextCellEntry,
} from "@glideapps/glide-data-grid";
import React from "react";

export interface ThumbnailCellProps {
  readonly kind: "thumbnail-cell";
  readonly image: string;
  readonly name: string;
}

export type ThumbnailCell = CustomCell<ThumbnailCellProps>;

export const thumbnailCellRenderer: CustomCellRenderer<ThumbnailCell> = {
  isMatch: (cell: CustomCell): cell is ThumbnailCell =>
    (cell.data as any).kind === "thumbnail-cell",
  draw: (args, cell) => {
    const { ctx, rect, theme, imageLoader, col, row } = args;
    const { image, name } = cell.data;

    const xPad = 7;
    const size = rect.height - xPad * 2;

    const drawX = rect.x + xPad;
    const drawY = rect.y + xPad;

    const imageResult = imageLoader.loadOrGetImage(image, col, row);

    ctx.save();

    if (imageResult !== undefined && image) {
      ctx.save();
      ctx.beginPath();
      ctx.drawImage(imageResult, drawX, drawY, size, size);
      ctx.restore();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, size, size, 4);
      ctx.fillStyle = theme.borderColor;
      ctx.fill();
      ctx.restore();
    }

    if (name !== undefined) {
      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        name,
        drawX + size + xPad,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
      );
    }

    ctx.restore();

    return true;
  },

  provideEditor: () => ({
    editor: p => {
      const { isHighlighted, onChange, value } = p;
      return (
        <TextCellEntry
          highlight={isHighlighted}
          autoFocus={true}
          readOnly={value.readonly}
          value={value.data.name ?? ""}
          onChange={e =>
            onChange({
              ...value,
              data: {
                ...value.data,
                name: e.target.value,
              },
            })
          }
        />
      );
    },
    disablePadding: true,
    deletedValue: cell => ({
      ...cell,
      copyData: "",
      data: {
        ...cell.data,
        name: "",
      },
    }),
  }),
  onPaste: (v, d) => ({
    ...d,
    name: v,
  }),
};
