import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from "react";

import {
  MODAL_ACTIONS_DISPLAY_NAME,
  MODAL_BODY_DISPLAY_NAME,
  MODAL_CHROME_DISPLAY_NAMES,
} from "./modalDisplayNames";

const getComponentDisplayName = (type: unknown): string | undefined => {
  if (typeof type === "function" || (typeof type === "object" && type !== null)) {
    return (type as { displayName?: string }).displayName;
  }

  return undefined;
};

const isModalComponent = (child: ReactNode, displayName: string): boolean => {
  return isValidElement(child) && getComponentDisplayName(child.type) === displayName;
};

const isChromeComponent = (child: ReactNode): boolean => {
  return MODAL_CHROME_DISPLAY_NAMES.some(displayName => isModalComponent(child, displayName));
};

const isModalLayoutPart = (child: ReactNode): boolean => {
  if (!isValidElement(child)) {
    return false;
  }

  return (
    isModalComponent(child, MODAL_BODY_DISPLAY_NAME) ||
    isModalComponent(child, MODAL_ACTIONS_DISPLAY_NAME) ||
    isChromeComponent(child)
  );
};

const flattenLayoutNodes = (nodes: ReactNode): ReactNode[] =>
  Children.toArray(nodes).flatMap(node => {
    if (!isValidElement(node)) {
      return node == null ? [] : [node];
    }

    const element: ReactElement = node;

    if (isModalLayoutPart(element)) {
      return [element];
    }

    if (element.props?.children == null) {
      return [element];
    }

    const inner = flattenLayoutNodes(element.props.children);

    if (element.type === Fragment || (inner.length > 0 && inner.every(isModalLayoutPart))) {
      return inner;
    }

    return [element];
  });

/** Unwrap fragments and single-child wrappers that only contain modal layout parts. */
export const getLayoutChildren = (children: ReactNode): ReactNode[] => flattenLayoutNodes(children);

/** Returns a non-fragment wrapper whose children are exclusively modal layout parts. */
export const getLayoutWrapper = (children: ReactNode): ReactElement | null => {
  if (!isValidElement(children) || children.type === Fragment || isModalLayoutPart(children)) {
    return null;
  }

  const items = flattenLayoutNodes(children);

  if (items.length > 0 && items.every(isModalLayoutPart)) {
    return children;
  }

  return null;
};
