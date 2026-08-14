import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown/ButtonGroupWithDropdown";
import { Button } from "@saleor/macaw-ui-next";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/** headerEnd actions stay this size so title-only and title+action cards share height. */
export const DETAIL_SETTINGS_CARD_HEADER_ACTION_SIZE = "small" as const;

type HeaderActionProps = {
  size?: string;
  children?: ReactNode;
};

const isHeaderAction = (element: ReactElement): boolean =>
  element.type === Button || element.type === ButtonGroupWithDropdown;

/**
 * Force macaw `Button` / `ButtonGroupWithDropdown` in `headerEnd` to small
 * unless the caller already set `size`. Recurses through layout wrappers
 * (Box, ripple anchors) so product-type assign controls pick it up.
 */
export const coerceHeaderEndActions = (node: ReactNode): ReactNode => {
  if (node == null || typeof node === "boolean") {
    return node;
  }

  if (Array.isArray(node)) {
    return Children.map(node, coerceHeaderEndActions);
  }

  if (!isValidElement(node)) {
    return node;
  }

  const element = node as ReactElement<HeaderActionProps>;

  if (isHeaderAction(element)) {
    if (element.props.size) {
      return element;
    }

    return cloneElement(element, { size: DETAIL_SETTINGS_CARD_HEADER_ACTION_SIZE });
  }

  if (element.props.children == null) {
    return element;
  }

  return cloneElement(element, {
    children: coerceHeaderEndActions(element.props.children),
  });
};
