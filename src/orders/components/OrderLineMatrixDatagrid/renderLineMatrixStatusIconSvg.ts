import { type PillStatusType } from "@dashboard/misc";
import { type OrderLineRollupStatus } from "@dashboard/orders/utils/getOrderLineRollupStatus";

const CIRCLE_SIZE = 28;
const ICON_VIEWBOX = 24;
const ICON_DRAW_SIZE = 16;
const ICON_SCALE = ICON_DRAW_SIZE / ICON_VIEWBOX;
const ICON_OFFSET = (CIRCLE_SIZE - ICON_DRAW_SIZE) / 2;
const RETURNED_ICON_VIEWBOX = 17;
const REFUNDED_ICON_VIEWBOX = 19;

const REFUND_ICON_PATHS = `
  <path d="M9.49998 14.25H3.16665C2.74672 14.25 2.34399 14.0832 2.04706 13.7863C1.75013 13.4893 1.58331 13.0866 1.58331 12.6667V6.33333C1.58331 5.91341 1.75013 5.51068 2.04706 5.21375C2.34399 4.91681 2.74672 4.75 3.16665 4.75H15.8333C16.2532 4.75 16.656 4.91681 16.9529 5.21375C17.2498 5.51068 17.4166 5.91341 17.4166 6.33333V10.2917"/>
  <path d="M15.0417 12.6666L12.6667 15.0416L15.0417 17.4166"/>
  <path d="M14.25 9.5H14.2579"/>
  <path d="M17.4167 15.0416L12.6667 15.0416"/>
  <path d="M4.75 9.5H4.75792"/>
  <path d="M9.50002 11.0833C10.3745 11.0833 11.0834 10.3744 11.0834 9.49996C11.0834 8.62551 10.3745 7.91663 9.50002 7.91663C8.62557 7.91663 7.91669 8.62551 7.91669 9.49996C7.91669 10.3744 8.62557 11.0833 9.50002 11.0833Z"/>
`;

const getIconTransform = (status: OrderLineRollupStatus): string => {
  if (status === "partiallyReturned" || status === "returned") {
    const scale = ICON_DRAW_SIZE / RETURNED_ICON_VIEWBOX;

    return `translate(${ICON_OFFSET}, ${ICON_OFFSET}) scale(${scale})`;
  }

  if (status === "refunded" || status === "refundDraft" || status === "refundFailed") {
    const scale = ICON_DRAW_SIZE / REFUNDED_ICON_VIEWBOX;

    return `translate(${ICON_OFFSET}, ${ICON_OFFSET}) scale(${scale})`;
  }

  return `translate(${ICON_OFFSET}, ${ICON_OFFSET}) scale(${ICON_SCALE})`;
};

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
  refunded: REFUND_ICON_PATHS,
  replaced: `
    <path d="M14 4l6 6-6 6"/>
    <path d="M4 20l6-6-6-6"/>
  `,
  refundDraft: REFUND_ICON_PATHS,
  refundFailed: REFUND_ICON_PATHS,
};

export const getOrderLineRollupPillType = (status: OrderLineRollupStatus): PillStatusType => {
  switch (status) {
    case "fulfilled":
      return "success";
    case "returned":
    case "refunded":
    case "replaced":
    case "partiallyReturned":
    case "refundDraft":
      return "info";
    case "refundFailed":
      return "error";
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
  const iconTransform = getIconTransform(status);
  const circleStroke = expanded ? selectedBorderColor : colors.border;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CIRCLE_SIZE}" height="${CIRCLE_SIZE}" viewBox="0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}">
    <circle cx="${CIRCLE_SIZE / 2}" cy="${CIRCLE_SIZE / 2}" r="${CIRCLE_SIZE / 2 - 1}" fill="${colors.base}" stroke="${circleStroke}" stroke-width="1"/>
    <g transform="${iconTransform}" stroke="${colors.text}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      ${iconPaths}
    </g>
  </svg>`;
};
