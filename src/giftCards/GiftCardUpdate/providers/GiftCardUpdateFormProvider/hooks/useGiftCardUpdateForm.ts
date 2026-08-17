import { type UseFormResult } from "@dashboard/hooks/useForm";
import { useContext } from "react";

import {
  type GiftCardUpdateFormConsumerData,
  GiftCardUpdateFormContext,
  type GiftCardUpdateFormData,
} from "../GiftCardUpdateFormProvider";

type UseGiftCardUpdateFormProps = UseFormResult<GiftCardUpdateFormData> &
  Omit<GiftCardUpdateFormConsumerData, "opts">;

const useGiftCardUpdateForm = (): UseGiftCardUpdateFormProps => {
  const giftCardUpdateFormProviderProps = useContext(GiftCardUpdateFormContext);

  if (!giftCardUpdateFormProviderProps) {
    throw new Error("useGiftCardUpdateForm must be used within a GiftCardUpdateFormProvider");
  }

  const { opts: _opts, ...rest } = giftCardUpdateFormProviderProps;

  return rest;
};

export default useGiftCardUpdateForm;
