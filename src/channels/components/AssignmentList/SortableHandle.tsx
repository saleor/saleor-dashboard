import { DragIcon, makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

const useStyles = makeStyles(
  {
    drag: {
      cursor: "grab",
    },
  },
  { name: "SortableHandle" },
);

interface SortableHandleProps {
  className?: string;
}

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const SortableHandle = SortableHandleHoc((props: SortableHandleProps) => {
  const { className, ...restProps } = props;
  const classes = useStyles(props);

  return (
    <DragIcon
      className={clsx(classes.drag, className)}
      tabIndex={0}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      {...restProps}
    />
  );
});

export default SortableHandle;
