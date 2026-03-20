import { useContext } from "react";

import {
  type GiftCardUpdateFormConsumerData,
  GiftCardUpdateFormContext,
} from "../GiftCardUpdateFormProvider";

const useGiftCardUpdate = (): Pick<GiftCardUpdateFormConsumerData, "opts"> => {
  const context = useContext(GiftCardUpdateFormContext);

  if (!context) {
    throw new Error("useGiftCardUpdate must be used within GiftCardUpdateFormProvider");
  }

  return { opts: context.opts };
};

export default useGiftCardUpdate;
