import { getAppMountUri } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { DataEditorProps, GridMouseEventArgs, Item } from "@glideapps/glide-data-grid";
import { useCallback, useRef, useState } from "react";

import { preventRowClickOnSelectionCheckbox } from "../utils";

export const useRowHover = ({
  rowAnchor,
  hasRowHover,
  rowMarkers,
}: {
  rowAnchor?: (item: Item) => string;
  rowMarkers?: DataEditorProps["rowMarkers"];
  hasRowHover?: boolean;
}) => {
  const [hoverRow, setHoverRow] = useState<number | undefined>(undefined);
  const hackARef = useRef<HTMLAnchorElement | null>(null);

  const handleRowHref = useCallback(
    (args: GridMouseEventArgs) => {
      if (args.kind !== "cell" || !hackARef.current || !rowAnchor) {
        return;
      }

      const href = rowAnchor(args.location);

      if (!href) {
        return;
      }

      if (preventRowClickOnSelectionCheckbox(rowMarkers, args.location[0])) {
        return;
      }

      hackARef.current.style.left = `${window.scrollX + args.bounds.x}px`;
      hackARef.current.style.width = `${args.bounds.width}px`;
      hackARef.current.style.top = `${window.scrollY + args.bounds.y}px`;
      hackARef.current.style.height = `${args.bounds.height}px`;
      hackARef.current.href = getAppMountUri() + (href.startsWith("/") ? href.slice(1) : href);
      hackARef.current.dataset.reactRouterPath = href;
    },
    [rowAnchor, rowMarkers],
  );

  const debouncedHandleRowHref = useDebounce(handleRowHref, 500);

  const handleSetHackARef = (element: HTMLAnchorElement) => {
    hackARef.current = element;
  };

  const handleRowHover = useCallback(
    (args: GridMouseEventArgs) => {
      if (hasRowHover) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, row] = args.location;

        setHoverRow(args.kind !== "cell" ? undefined : row);
      }

      debouncedHandleRowHref(args);
    },
    [debouncedHandleRowHref, hasRowHover],
  );

  return {
    hoverRow,
    hackARef,
    handleRowHover,
    handleSetHackARef,
  };
};
