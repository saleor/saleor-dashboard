import { type UseFormResult } from "@dashboard/hooks/useForm";
import omit from "lodash/omit";
import { useContext } from "react";

import {
  GiftCardUpdateFormContext,
  type GiftCardUpdateFormData,
  type GiftCardUpdateFormErrors,
} from "../GiftCardUpdateFormProvider";

type UseGiftCardUpdateFormProps = UseFormResult<GiftCardUpdateFormData> & GiftCardUpdateFormErrors;

const useGiftCardUpdate = (): UseGiftCardUpdateFormProps => {
  const giftCardUpdateFormProviderProps = useContext(GiftCardUpdateFormContext);

  return omit(giftCardUpdateFormProviderProps, ["opts"]);
};

export default useGiftCardUpdate;
