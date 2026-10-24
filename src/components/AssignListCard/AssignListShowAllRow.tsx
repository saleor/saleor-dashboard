import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { type ReactNode } from "react";

import styles from "./AssignListShowAllRow.module.css";

/** How many rows a sidebar assign list shows before it ends in a show-all row. */
export const ASSIGN_LIST_PREVIEW_COUNT = 5;

/** Ends a truncated assign list, where the eye reaches the last row. */
export const AssignListShowAllRow = ({
  label,
  onClick,
  className,
  "data-test-id": dataTestId,
}: {
  label: ReactNode;
  onClick: () => void;
  /** Adjust separators when the host list draws its own row borders. */
  className?: string;
  "data-test-id"?: string;
}): ReactNode => (
  <button
    type="button"
    className={clsx(styles.row, className)}
    data-test-id={dataTestId}
    onClick={onClick}
  >
    <Text size={3} fontWeight="medium">
      {label}
    </Text>
    <ChevronRight size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} aria-hidden />
  </button>
);
