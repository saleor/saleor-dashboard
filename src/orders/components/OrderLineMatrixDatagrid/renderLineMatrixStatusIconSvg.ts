import { type PillStatusType } from "@dashboard/misc";
import { type OrderLineRollupStatus } from "@dashboard/orders/utils/getOrderLineRollupStatus";

const CIRCLE_SIZE = 28;
const ICON_VIEWBOX = 24;
const ICON_DRAW_SIZE = 16;
const ICON_SCALE = ICON_DRAW_SIZE / ICON_VIEWBOX;
const ICON_OFFSET = (CIRCLE_SIZE - ICON_DRAW_SIZE) / 2;

interface StatusIconColors {
  base: string;
  border: string;
  text: string;
}

const ICON_PATHS: Record<OrderLineRollupStatus, string> = {
  waitingForApproval: `
    <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"/>
    <path d="M3 21h18"/>
  `,
  toFulfill: `
    <path d="M16.5 9.4l-9-5.19"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
    <path d="M12 22.08V12"/>
  `,
  partiallyFulfilled: `
    <path d="M16.5 9.4l-9-5.19"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
    <path d="M12 22.08V12"/>
  `,
  fulfilled: `
    <path d="M16.5 9.4l-9-5.19"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
    <path d="M12 22.08V12"/>
  `,
  partiallyReturned: `
    <path d="M14.875 8.5V5.66664C14.8747 5.41821 14.8092 5.17421 14.6848 4.95913C14.5605 4.74405 14.3818 4.56544 14.1667 4.44122L9.20833 1.60789C8.99297 1.48355 8.74868 1.41809 8.5 1.41809C8.25132 1.41809 8.00703 1.48355 7.79167 1.60789L2.83333 4.44122C2.61819 4.56544 2.43949 4.74405 2.31516 4.95913C2.19083 5.17421 2.12525 5.41821 2.125 5.66664V11.3333"/>
    <path d="M8.5 15.5833V8.5"/>
    <path d="M2.33044 4.95831L8.50003 8.49998L14.6696 4.95831"/>
    <path d="M12.875 12.75L11 10.875L12.875 9"/>
    <path d="M11 10.875H14.9375C15.4766 10.9283 15.7268 11.032 16.3959 11.4791C16.5874 11.6706 16.7394 11.898 16.843 12.1482C16.9467 12.3984 17 12.6666 17 12.9375"/>
  `,
  returned: `
    <path d="M14.875 8.5V5.66664C14.8747 5.41821 14.8092 5.17421 14.6848 4.95913C14.5605 4.74405 14.3818 4.56544 14.1667 4.44122L9.20833 1.60789C8.99297 1.48355 8.74868 1.41809 8.5 1.41809C8.25132 1.41809 8.00703 1.48355 7.79167 1.60789L2.83333 4.44122C2.61819 4.56544 2.43949 4.74405 2.31516 4.95913C2.19083 5.17421 2.12525 5.41821 2.125 5.66664V11.3333"/>
    <path d="M8.5 15.5833V8.5"/>
    <path d="M2.33044 4.95831L8.50003 8.49998L14.6696 4.95831"/>
    <path d="M12.875 12.75L11 10.875L12.875 9"/>
    <path d="M11 10.875H14.9375C15.4766 10.9283 15.7268 11.032 16.3959 11.4791C16.5874 11.6706 16.7394 11.898 16.843 12.1482C16.9467 12.3984 17 12.6666 17 12.9375"/>
  `,
  refunded: `
    <path d="M9.49998 14.25H3.16665C2.74672 14.25 2.34399 14.0832 2.04706 13.7863C1.75013 13.4893 1.58331 13.0866 1.58331 12.6667V6.33333C1.58331 5.91341 1.75013 5.51068 2.04706 5.21375C2.34399 4.91681 2.74672 4.75 3.16665 4.75H15.8333C16.2532 4.75 16.656 4.91681 16.9529 5.21375C17.2498 5.51068 17.4166 5.91341 17.4166 6.33333V10.2917"/>
    <path d="M17.4166 10.2917H14.25C13.4212 10.2917 12.6263 10.6208 12.0327 11.2144C11.4391 11.808 11.11 12.6029 11.11 13.4317C11.11 14.2605 11.4391 15.0554 12.0327 15.649C12.6263 16.2426 13.4212 16.5717 14.25 16.5717H15.8333"/>
    <path d="M5.54165 7.91667H5.54998"/>
    <path d="M14.25 13.4583H14.2583"/>
  `,
  replaced: `
    <path d="M14 4l6 6-6 6"/>
    <path d="M4 20l6-6-6-6"/>
  `,
};

export const getOrderLineRollupPillType = (status: OrderLineRollupStatus): PillStatusType => {
  switch (status) {
    case "fulfilled":
      return "success";
    case "returned":
    case "refunded":
    case "replaced":
    case "partiallyReturned":
      return "info";
    default:
      return "warning";
  }
};

export const renderLineMatrixStatusIconSvg = (
  status: OrderLineRollupStatus,
  colors: StatusIconColors,
  expanded: boolean,
  selectedBorderColor: string,
): string => {
  const iconPaths = ICON_PATHS[status];
  const returnedScale =
    status === "partiallyReturned" || status === "returned" ? 16 / 17 : ICON_SCALE;
  const returnedOffset =
    status === "partiallyReturned" || status === "returned" ? (CIRCLE_SIZE - 16) / 2 : ICON_OFFSET;
  const iconTransform =
    status === "partiallyReturned" || status === "returned"
      ? `translate(${returnedOffset}, ${returnedOffset}) scale(${returnedScale})`
      : `translate(${ICON_OFFSET}, ${ICON_OFFSET}) scale(${ICON_SCALE})`;
  const expandedRing = expanded
    ? `<circle cx="${CIRCLE_SIZE / 2}" cy="${CIRCLE_SIZE / 2}" r="${CIRCLE_SIZE / 2 - 1}" fill="none" stroke="${selectedBorderColor}" stroke-width="2"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CIRCLE_SIZE}" height="${CIRCLE_SIZE}" viewBox="0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}">
    ${expandedRing}
    <circle cx="${CIRCLE_SIZE / 2}" cy="${CIRCLE_SIZE / 2}" r="${CIRCLE_SIZE / 2 - 1}" fill="${colors.base}" stroke="${expanded ? selectedBorderColor : colors.border}" stroke-width="1"/>
    <g transform="${iconTransform}" stroke="${colors.text}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      ${iconPaths}
    </g>
  </svg>`;
};
