import { PropsWithChildren } from "react";
import {
  SortableContainer as SortableContainerHoc,
  SortableContainerProps as SortableContainerHocProps,
} from "react-sortable-hoc";

type SortableContainerProps = PropsWithChildren<SortableContainerHocProps>;

/** @deprecated This should be removed in favor of @dnd-kit */
const SortableContainer = SortableContainerHoc(({ children }: SortableContainerProps) => children);

export default SortableContainer;
