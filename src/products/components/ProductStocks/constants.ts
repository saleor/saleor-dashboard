import { z } from "zod";

export const SKU_ERROR_MESSAGE = {
  required: "SKU jest wymagany",
  invalidType: "SKU może zawierać wyłącznie cyfry",
  positive: "SKU musi być większe od 0",
};

export const SkuSchema = z
  .number({
    required_error: SKU_ERROR_MESSAGE.required,
    invalid_type_error: SKU_ERROR_MESSAGE.invalidType,
  })
  .int({ message: SKU_ERROR_MESSAGE.invalidType })
  .positive({ message: SKU_ERROR_MESSAGE.positive });
