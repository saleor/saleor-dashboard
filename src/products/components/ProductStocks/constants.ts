import { z } from "zod";

export const SKU_ERROR_MESSAGE = {
  required: "SKU jest wymagany",
  invalidType: "SKU może zawierać wyłącznie cyfry",
  positive: "SKU musi być większe od 0",
  skuIsInvalid: "SKU jest nieprawidłowe",
  sthWentWrong: "Coś poszło nie tak",
};

export const SkuSchema = z
  .number({
    required_error: SKU_ERROR_MESSAGE.required,
    invalid_type_error: SKU_ERROR_MESSAGE.invalidType,
  })
  .int({ message: SKU_ERROR_MESSAGE.invalidType })
  .positive({ message: SKU_ERROR_MESSAGE.positive });

export const ONE_SECOND = 1000;
