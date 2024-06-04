import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
} from "@glideapps/glide-data-grid";
import React from "react";

export interface ThumbnailCellProps {
  readonly kind: "thumbnail-cell";
  readonly image: string;
  readonly name: string;
}

export type ThumbnailCell = CustomCell<ThumbnailCellProps>;

export const thumbnailCellRenderer: CustomRenderer<ThumbnailCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is ThumbnailCell =>
    (cell.data as any).kind === "thumbnail-cell",
  draw: (args, cell) => {
    const { ctx, rect, theme, imageLoader, col, row } = args;
    const { image, name } = cell.data;
    const xPad = 5;
    const size = rect.height - xPad * 2;
    const drawX = rect.x + xPad;
    const drawY = rect.y + xPad;
    const imageResult = imageLoader.loadOrGetImage(image, col, row);

    ctx.save();

    if (imageResult !== undefined && image) {
      roundedImage(ctx, drawX, drawY, size, size, 4);
      ctx.strokeStyle = theme.borderColor;
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(imageResult, drawX, drawY, size, size);
    } else {
      ctx.beginPath();
      roundedImage(ctx, drawX, drawY, size, size, 4);
      ctx.fillStyle = theme.borderColor;
      ctx.fill();
    }

    ctx.restore();

    if (name !== undefined) {
      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        name,
        drawX + size + 10,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
      );
    }

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

function roundedImage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
