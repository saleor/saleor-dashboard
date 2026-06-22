/**
 * Canvas / Datagrid only — do not use in React UI.
 *
 * Glide Data Grid paints cells on <canvas>, so we cannot render AttributeClassIcon
 * (or react-dom/server) here. This file holds SVG markup for the icons in
 * AttributeClass.tsx so AttributeTypeCell can draw via drawImage().
 *
 * For forms and anywhere else in the app, use AttributeClassDisplay / ClickableAttributeClass.
 *
 * If you change an icon in AttributeClass.tsx or Modeling.tsx, update the matching SVG below.
 */
import { escapeSvgAttribute } from "@dashboard/components/AttributeInputTypeIcon/iconNodeToSvg";
import { getNavigationCustomIconStrokeWidth } from "@dashboard/components/icons";
import { AttributeTypeEnum } from "@dashboard/graphql";

const MODELING_VIEWBOX_SIZE = 20;

const ATTRIBUTES_PATH =
  "M29 3C29.5523 3 30 3.44772 30 4V8C30 8.55229 29.5523 9 29 9C28.4477 9 28 8.55229 28 8V7L12 7V8C12 8.55229 11.5523 9 11 9C10.4477 9 10 8.55229 10 8V4C10 3.44772 10.4477 3 11 3C11.5523 3 12 3.44772 12 4V5L28 5V4C28 3.44772 28.4477 3 29 3ZM2 12C2 11.4477 2.44772 11 3 11H7C7.55228 11 8 11.4477 8 12C8 12.5523 7.55228 13 7 13H6V27H7C7.55228 27 8 27.4477 8 28C8 28.5523 7.55228 29 7 29H3C2.44772 29 2 28.5523 2 28C2 27.4477 2.44772 27 3 27H4V13H3C2.44772 13 2 12.5523 2 12ZM14.2997 11C13.1142 11 12.0398 11.6982 11.5583 12.7816L10.0862 16.0939C10.0294 16.2217 10 16.3601 10 16.5V26C10 27.6569 11.3431 29 13 29H27C28.6569 29 30 27.6569 30 26V16.5C30 16.3601 29.9706 16.2217 29.9138 16.0939L28.4417 12.7816C27.9602 11.6982 26.8858 11 25.7003 11H14.2997ZM13.3859 13.5939C13.5464 13.2327 13.9046 13 14.2997 13H25.7003C26.0954 13 26.4536 13.2327 26.6141 13.5939L27.4612 15.5H12.5388L13.3859 13.5939ZM23.5 17.5H28V26C28 26.5523 27.5523 27 27 27H13C12.4477 27 12 26.5523 12 26V17.5H16.5V23C16.5 23.3603 16.6938 23.6927 17.0073 23.8702C17.3208 24.0477 17.7056 24.0429 18.0145 23.8575L20 22.6662L21.9855 23.8575C22.2944 24.0429 22.6792 24.0477 22.9927 23.8702C23.3062 23.6927 23.5 23.3603 23.5 23V17.5ZM18.5 21.2338V17.5H21.5V21.2338L20.5145 20.6425C20.1978 20.4525 19.8022 20.4525 19.4855 20.6425L18.5 21.2338Z";

const renderModelingIconSvg = (size: number, color: string): string => {
  const strokeWidth = getNavigationCustomIconStrokeWidth(MODELING_VIEWBOX_SIZE);
  const escapedColor = escapeSvgAttribute(color);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="${escapedColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V7.5C2.5 8.42047 3.24619 9.16667 4.16667 9.16667H7.5C8.42047 9.16667 9.16667 8.42047 9.16667 7.5V4.16667C9.16667 3.24619 8.42047 2.5 7.5 2.5Z"/><path d="M16.0417 2.5H13.9584C13.3831 2.5 12.9167 2.96637 12.9167 3.54167V5.625C12.9167 6.2003 13.3831 6.66667 13.9584 6.66667H16.0417C16.617 6.66667 17.0834 6.2003 17.0834 5.625V3.54167C17.0834 2.96637 16.617 2.5 16.0417 2.5Z"/><path d="M5.83331 9.16663V12.5C5.83331 12.942 6.00891 13.3659 6.32147 13.6785C6.63403 13.991 7.05795 14.1666 7.49998 14.1666H10.8333"/><path d="M15.8333 10.8334H12.5C11.5795 10.8334 10.8333 11.5796 10.8333 12.5V15.8334C10.8333 16.7538 11.5795 17.5 12.5 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8334V12.5C17.5 11.5796 16.7538 10.8334 15.8333 10.8334Z"/><path d="M15 10.8333V7.5"/></svg>`;
};

const renderProductAttributeIconSvg = (size: number, color: string): string => {
  const escapedColor = escapeSvgAttribute(color);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="${escapedColor}" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="${ATTRIBUTES_PATH}"/></svg>`;
};

export const renderAttributeClassIconSvg = (
  attributeType: AttributeTypeEnum,
  size = 12,
  color = "currentColor",
): string => {
  if (attributeType === AttributeTypeEnum.PAGE_TYPE) {
    return renderModelingIconSvg(size, color);
  }

  return renderProductAttributeIconSvg(size, color);
};
