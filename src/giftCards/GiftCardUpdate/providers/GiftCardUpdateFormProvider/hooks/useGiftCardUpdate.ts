import { useContext } from "react";

import {
  GiftCardUpdateFormConsumerData,
  GiftCardUpdateFormContext,
} from "../GiftCardUpdateFormProvider";

const useGiftCardUpdate = (): Pick<GiftCardUpdateFormConsumerData, "opts"> => {
  const { opts } = useContext(GiftCardUpdateFormContext);

  return { opts };
};

export default useGiftCardUpdate;
