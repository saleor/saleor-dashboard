import { PropsWithBox } from "@saleor/macaw-ui-next";

type RemovedProps = "color" | "height" | "width";

export type GridTableProps<T> = PropsWithBox<Omit<T, RemovedProps>>;
