import { UseFormResult } from "@saleor/hooks/useForm";
import omit from "lodash/omit";
import { useContext } from "react";

import {
  GiftCardUpdateFormContext,
  GiftCardUpdateFormData,
  GiftCardUpdateFormErrors,
} from "../GiftCardUpdateFormProvider";

type UseGiftCardUpdateFormProps = UseFormResult<GiftCardUpdateFormData> &
  GiftCardUpdateFormErrors;

const useGiftCardUpdate = (): UseGiftCardUpdateFormProps => {
  const giftCardUpdateFormProviderProps = useContext(GiftCardUpdateFormContext);

  return omit(giftCardUpdateFormProviderProps, ["opts"]);
};

export default useGiftCardUpdate;
