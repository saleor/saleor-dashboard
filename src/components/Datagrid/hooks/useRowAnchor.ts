import { getAppMountUri } from "@dashboard/config";
import { getCellAction } from "@dashboard/products/components/ProductListDatagrid/datagrid";
import {
  type DataEditorProps,
  type GridMouseEventArgs,
  type Item,
} from "@glideapps/glide-data-grid";
import { useCallback, useEffect, useRef } from "react";

import { type AvailableColumn } from "../types";
import { preventRowClickOnSelectionCheckbox } from "../utils";

export const hideRowAnchorElement = (anchor: HTMLAnchorElement): void => {
  anchor.style.display = "none";
  anchor.removeAttribute("href");
  delete anchor.dataset.reactRouterPath;
};

/**
 * Canvas cmd/ctrl-click cannot open a tab via dispatchEvent: that click is
 * untrusted, so the browser ignores the link default. window.open still runs
 * in the user-gesture stack from Glide's onCellClicked.
 */
export const activateRowAnchor = (
  anchor: HTMLAnchorElement | null,
  { openInNewTab }: { openInNewTab: boolean },
): void => {
  if (!anchor?.href) {
    return;
  }

  if (openInNewTab) {
    window.open(anchor.href, "_blank", "noopener,noreferrer");

    return;
  }

  anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
};

export const useRowAnchor = ({
  getRowAnchorUrl,
  rowMarkers,
  availableColumns,
  onWheel,
}: {
  getRowAnchorUrl?: (item: Item) => string;
  rowMarkers?: DataEditorProps["rowMarkers"];
  availableColumns?: readonly AvailableColumn[];
  onWheel?: (event: WheelEvent) => void;
}) => {
  const rowAnchorRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(function hideRowAnchorOnViewportChange() {
    const hide = (): void => {
      if (rowAnchorRef.current) {
        hideRowAnchorElement(rowAnchorRef.current);
      }
    };

    // Wheel on the overlay is handled separately. Keyboard scroll, scrollbar
    // drag, and scroller pans never hit that listener — without this, a
    // position:fixed href stays under the cursor pointing at the wrong row.
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);

    return (): void => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);

  const setRowAnchorRef = useCallback(
    (element: HTMLAnchorElement | null) => {
      const previous = rowAnchorRef.current;

      if (previous && onWheel) {
        previous.removeEventListener("wheel", onWheel);
      }

      rowAnchorRef.current = element;

      // Native listener: React's onWheel is passive, so preventDefault would be ignored.
      // Bind on mount so this still attaches after the loading gate unmounts the <a>.
      if (element && onWheel) {
        element.addEventListener("wheel", onWheel, { passive: false });
      }
    },
    [onWheel],
  );

  const setAnchorPosition = useCallback(
    (args: GridMouseEventArgs) => {
      const anchor = rowAnchorRef.current;

      if (!anchor) {
        return;
      }

      // Hide immediately (not debounced). Glide ignores moves that land on this
      // overlay; a parked anchor would swallow re-entry and freeze the hover row.
      if (args.kind !== "cell" || !getRowAnchorUrl) {
        hideRowAnchorElement(anchor);

        return;
      }

      const action = getCellAction(availableColumns, args.location[0]);
      const href = getRowAnchorUrl(args.location);

      if (!href || action) {
        hideRowAnchorElement(anchor);

        return;
      }

      if (preventRowClickOnSelectionCheckbox(rowMarkers, args.location[0])) {
        hideRowAnchorElement(anchor);

        return;
      }

      // Glide reports viewport bounds; the anchor is position:fixed, so use them as-is.
      anchor.style.left = `${args.bounds.x}px`;
      anchor.style.width = `${args.bounds.width}px`;
      anchor.style.top = `${args.bounds.y}px`;
      anchor.style.height = `${args.bounds.height}px`;
      anchor.href = getAppMountUri() + (href.startsWith("/") ? href.slice(1) : href);
      anchor.dataset.reactRouterPath = href;
      anchor.style.display = "block";
    },
    [availableColumns, getRowAnchorUrl, rowMarkers],
  );

  return {
    rowAnchorRef,
    setRowAnchorRef,
    setAnchorPosition,
  };
};
