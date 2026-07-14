import { iconSize } from "@dashboard/components/icons";
import {
  THROBBER_ANIMATION_DURATION_MS,
  THROBBER_BEAM_LENGTH,
  THROBBER_PATH_D,
  THROBBER_PATH_LENGTH,
  THROBBER_VIEWBOX_SIZE,
} from "@dashboard/components/Throbber/throbberGeometry";
import { type CustomRenderer, GridCellKind } from "@glideapps/glide-data-grid";

import { type ThrobberCell } from "./cells";

const throbberPath = new Path2D(THROBBER_PATH_D);

export const throbberCellRenderer: CustomRenderer<ThrobberCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell): cell is ThrobberCell =>
    (cell.data as { kind?: string })?.kind === "throbber-cell",
  draw: args => {
    const { ctx, rect, theme, requestAnimationFrame } = args;
    const size = Math.min(iconSize.small, rect.width - 4, rect.height - 4);
    const scale = size / THROBBER_VIEWBOX_SIZE;
    const originX = rect.x + (rect.width - size) / 2;
    const originY = rect.y + (rect.height - size) / 2;
    const progress =
      (window.performance.now() % THROBBER_ANIMATION_DURATION_MS) / THROBBER_ANIMATION_DURATION_MS;
    const dashOffset = THROBBER_PATH_LENGTH * (1 - progress);

    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = theme.textDark;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 0.75 / scale;
    ctx.setLineDash([]);
    ctx.stroke(throbberPath);

    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.5 / scale;
    ctx.setLineDash([THROBBER_BEAM_LENGTH, THROBBER_PATH_LENGTH - THROBBER_BEAM_LENGTH]);
    ctx.lineDashOffset = dashOffset;
    ctx.stroke(throbberPath);

    ctx.restore();
    requestAnimationFrame();

    return true;
  },
};
