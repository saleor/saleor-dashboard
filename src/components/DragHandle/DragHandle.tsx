import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import clsx from "clsx";
import { GripVertical, type LucideProps } from "lucide-react";

import styles from "./DragHandle.module.css";

type DragHandleCursor = "grab" | "grabbing" | "not-allowed" | "inherit";

interface DragHandleProps extends Omit<LucideProps, "size" | "strokeWidth"> {
  cursor?: DragHandleCursor;
}

const cursorClassName: Record<DragHandleCursor, string | undefined> = {
  grab: styles.grab,
  grabbing: styles.grabbing,
  "not-allowed": styles.notAllowed,
  inherit: undefined,
};

/** Lucide drag grip shared by channel inventory rows and collection product reordering. */
export const DragHandle = ({
  className,
  cursor = "grab",
  ...props
}: DragHandleProps): JSX.Element => (
  <GripVertical
    className={clsx(styles.root, cursorClassName[cursor], className)}
    size={iconSize.small}
    strokeWidth={iconStrokeWidthBySize.small}
    aria-hidden
    {...props}
  />
);
