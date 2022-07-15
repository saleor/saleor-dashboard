import {
  SortableContainer as SortableContainerHoc,
  SortableContainerProps as SortableContainerHocProps,
} from "react-sortable-hoc";

interface SortableContainerProps extends SortableContainerHocProps {
  children: React.ReactElement;
}

const SortableContainer = SortableContainerHoc(
  ({ children }: SortableContainerProps) => children,
);

export default SortableContainer;
