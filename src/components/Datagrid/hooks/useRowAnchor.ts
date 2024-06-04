import { getAppMountUri } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { DataEditorProps, GridMouseEventArgs, Item } from "@glideapps/glide-data-grid";
import { useCallback, useRef } from "react";

import { preventRowClickOnSelectionCheckbox } from "../utils";

const DEBOUNCE_TIME = 100;

export const useRowAnchor = ({
  getRowAnchorUrl,
  rowMarkers,
}: {
  getRowAnchorUrl?: (item: Item) => string;
  rowMarkers?: DataEditorProps["rowMarkers"];
}) => {
  const rowAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const setRowAnchorRef = useCallback((element: HTMLAnchorElement) => {
    rowAnchorRef.current = element;
  }, []);

  const setAnchorPosition = useCallback(
    useDebounce((args: GridMouseEventArgs) => {
      if (args.kind !== "cell" || !rowAnchorRef.current || !getRowAnchorUrl) {
        return;
      }

      const href = getRowAnchorUrl(args.location);

      if (!href) {
        return;
      }

      if (preventRowClickOnSelectionCheckbox(rowMarkers, args.location[0])) {
        return;
      }

      rowAnchorRef.current.style.left = `${window.scrollX + args.bounds.x}px`;
      rowAnchorRef.current.style.width = `${args.bounds.width}px`;
      rowAnchorRef.current.style.top = `${window.scrollY + args.bounds.y}px`;
      rowAnchorRef.current.style.height = `${args.bounds.height}px`;
      rowAnchorRef.current.href = getAppMountUri() + (href.startsWith("/") ? href.slice(1) : href);
      rowAnchorRef.current.dataset.reactRouterPath = href;
    }, DEBOUNCE_TIME),
    [getRowAnchorUrl, rowMarkers],
  );

  return {
    rowAnchorRef,
    setRowAnchorRef,
    setAnchorPosition,
  };
};
