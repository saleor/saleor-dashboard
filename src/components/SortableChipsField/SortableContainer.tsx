import { ReactElement } from "react";
import {
  SortableContainer as SortableContainerHoc,
  SortableContainerProps as SortableContainerHocProps,
} from "react-sortable-hoc";

interface SortableContainerProps extends SortableContainerHocProps {
  children: ReactElement;
}

const SortableContainer = SortableContainerHoc<SortableContainerProps>(
  ({ children }: SortableContainerProps) => children,
);

export default SortableContainer;
