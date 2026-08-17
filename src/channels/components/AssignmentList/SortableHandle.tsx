import { DragHandle } from "@dashboard/components/DragHandle/DragHandle";
import clsx from "clsx";
// Legacy shared with AssignmentList — migrate together to @dnd-kit.
// eslint-disable-next-line no-restricted-imports
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

interface SortableHandleProps {
  className?: string;
}

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const SortableHandle = SortableHandleHoc(({ className }: SortableHandleProps) => (
  <DragHandle className={clsx(className)} tabIndex={0} />
));

export default SortableHandle;
