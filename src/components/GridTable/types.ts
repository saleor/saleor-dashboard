import { type PropsWithBox } from "@macaw-ui";

type RemovedProps = "color" | "height" | "width" | "dangerouslySetInnerHTML";

export type GridTableProps<T> = PropsWithBox<Omit<T, RemovedProps>>;
