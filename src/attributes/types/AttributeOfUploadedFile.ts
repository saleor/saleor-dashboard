import { AttributeValueInput } from "@saleor/types/globalTypes";

export type AtributesOfFiles = Pick<AttributeValueInput, "file" | "id" | "values" | "contentType">
