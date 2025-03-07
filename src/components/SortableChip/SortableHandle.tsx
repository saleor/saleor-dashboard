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

const SortableHandle = SortableHandleHoc<SortableHandleProps>((props: SortableHandleProps) => {
  const { className, ...restProps } = props;
  const classes = useStyles(props);

  return (
    // @ts-expect-error wrong typing in the old macaw-ui
    <DragIcon className={clsx(classes.drag, className)} tabIndex={0} {...restProps} />
  );
});

export default SortableHandle;
