import { useContext } from "react";

import {
  GiftCardUpdateFormConsumerData,
  GiftCardUpdateFormContext
} from "../providers/GiftCardUpdateFormProvider";

const useGiftCardUpdate = (): Pick<GiftCardUpdateFormConsumerData, "opts"> => {
  const { opts } = useContext(GiftCardUpdateFormContext);

  return { opts };
};

export default useGiftCardUpdate;
