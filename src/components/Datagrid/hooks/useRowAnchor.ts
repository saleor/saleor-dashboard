import { getAppMountUri } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { getCellAction } from "@dashboard/products/components/ProductListDatagrid/datagrid";
import {
  type DataEditorProps,
  type GridMouseEventArgs,
  type Item,
} from "@glideapps/glide-data-grid";
import { useCallback, useRef } from "react";

import { type AvailableColumn } from "../types";
import { preventRowClickOnSelectionCheckbox } from "../utils";

const DEBOUNCE_TIME = 100;

export const useRowAnchor = ({
  getRowAnchorUrl,
  rowMarkers,
  availableColumns,
}: {
  getRowAnchorUrl?: (item: Item) => string;
  rowMarkers?: DataEditorProps["rowMarkers"];
  availableColumns?: readonly AvailableColumn[];
}) => {
  const rowAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const setRowAnchorRef = useCallback((element: HTMLAnchorElement) => {
    rowAnchorRef.current = element;
  }, []);

  const setAnchorPosition = useCallback(
    useDebounce((args: GridMouseEventArgs) => {
      const anchor = rowAnchorRef.current;

      if (!anchor) {
        return;
      }

      // The anchor only stays visible while it covers the cell under the pointer. Anywhere else
      // it is hidden, so a click can never resolve to a row the cursor has left, and so pointer
      // events keep reaching the grid canvas - Glide ignores moves that land on an overlay, and
      // a parked anchor would otherwise swallow the re-entry into its own cell and leave the row
      // without its hover highlight.
      if (args.kind !== "cell" || !getRowAnchorUrl) {
        anchor.style.display = "none";

        return;
      }

      const action = getCellAction(availableColumns, args.location[0]);
      const href = getRowAnchorUrl(args.location);

      if (!href || action) {
        anchor.style.display = "none";

        return;
      }

      if (preventRowClickOnSelectionCheckbox(rowMarkers, args.location[0])) {
        anchor.style.display = "none";

        return;
      }

      // Glide reports cell bounds in viewport coordinates and the anchor is positioned with
      // `position: fixed`, so the bounds are used as they come. Adding the page scroll offset
      // turned them into document coordinates, which placed the anchor away from the cell it
      // points at, so native link gestures (right click, middle click) landed on the canvas
      // instead of the link.
      anchor.style.left = `${args.bounds.x}px`;
      anchor.style.width = `${args.bounds.width}px`;
      anchor.style.top = `${args.bounds.y}px`;
      anchor.style.height = `${args.bounds.height}px`;
      anchor.href = getAppMountUri() + (href.startsWith("/") ? href.slice(1) : href);
      anchor.dataset.reactRouterPath = href;
      anchor.style.display = "block";
    }, DEBOUNCE_TIME),
    [getRowAnchorUrl, rowMarkers],
  );

  return {
    rowAnchorRef,
    setRowAnchorRef,
    setAnchorPosition,
  };
};
