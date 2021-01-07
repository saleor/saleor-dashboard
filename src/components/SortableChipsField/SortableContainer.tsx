import { SortableContainer as SortableContainerHoc } from "react-sortable-hoc";

const SortableContainer = SortableContainerHoc(({ children }) => children);

export default SortableContainer;
