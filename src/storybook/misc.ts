import { ProductErrorFragment } from "@saleor/attributes/types/ProductErrorFragment";

export function formError<TErrorPayload>(
  field: string,
  opts?: Partial<Omit<TErrorPayload, "field" | "message">>
) {
  return {
    field,
    message: "Generic form error",
    ...opts
  };
}
