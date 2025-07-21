import {
  SortableContainer as SortableContainerHoc,
  SortableContainerProps as SortableContainerHocProps,
} from "react-sortable-hoc";

interface SortableContainerProps extends SortableContainerHocProps {
  children: React.ReactElement;
}

/** @deprecated This should be removed in favor of @dnd-kit */
const SortableContainer = SortableContainerHoc(({ children }: SortableContainerProps) => children);

export default SortableContainer;
