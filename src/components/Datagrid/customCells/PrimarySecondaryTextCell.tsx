import {
  type CustomCell,
  type CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";

interface PrimarySecondaryTextCellProps {
  readonly kind: "primary-secondary-text-cell";
  readonly primary: string;
  readonly secondary?: string;
}

export type PrimarySecondaryTextCell = CustomCell<PrimarySecondaryTextCellProps>;

export const primarySecondaryTextCellRenderer: CustomRenderer<PrimarySecondaryTextCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is PrimarySecondaryTextCell =>
    (cell.data as { kind?: string }).kind === "primary-secondary-text-cell",
  draw: (args, cell) => {
    const { ctx, rect, theme } = args;
    const { primary, secondary } = cell.data;
    const textY = rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme);
    let textX = rect.x + theme.cellHorizontalPadding;

    ctx.font = theme.baseFontStyle;

    if (primary) {
      ctx.fillStyle = theme.textDark;
      ctx.fillText(primary, textX, textY);
      textX += ctx.measureText(primary).width;
    }

    if (secondary) {
      ctx.fillStyle = theme.textLight;
      ctx.fillText(secondary, textX, textY);
    }

    return true;
  },
};
