import { v4 as uuidv4 } from "uuid";

export const generateMultipleIds = (quantity: string, prefix?: string) => {
  return Array.from({ length: Number(quantity) }).map(() => ({
    code: prefix ? `${prefix}-${uuidv4()}` : uuidv4(),
    status: "Draft",
  }));
};
