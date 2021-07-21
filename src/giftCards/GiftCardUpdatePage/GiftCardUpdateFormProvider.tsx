import Form from "@saleor/components/Form";
import { UseFormResult } from "@saleor/hooks/useForm";
import React, { createContext, useContext, useState } from "react";

import { GiftCardDetailsContext } from "./GiftCardDetailsProvider";
import { GiftCardDetails_giftCard } from "./types/GiftCardDetails";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
}

export type GiftCardUpdateFormData = Pick<
  GiftCardDetails_giftCard,
  "tag" | "expiryDate" | "expiryType" | "expiryPeriod"
>;

export interface GiftCardUpdateFormConsumerProps
  extends UseFormResult<GiftCardUpdateFormData> {
  selectedTag: string;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
}

export const GiftCardUpdateFormContext = createContext<
  GiftCardUpdateFormConsumerProps
>(null);

const GiftCardUpdateFormProvider: React.FC<GiftCardUpdateFormProviderProps> = ({
  children
}) => {
  const {
    giftCard: { tag, expiryDate, expiryPeriod, expiryType }
  } = useContext(GiftCardDetailsContext);

  const [selectedTag, setSelectedTag] = useState(tag);

  const initialData = { tag, expiryDate, expiryPeriod, expiryType };

  return (
    <Form initial={initialData}>
      {formProps => {
        const providerValues: GiftCardUpdateFormConsumerProps = {
          ...formProps,
          selectedTag,
          setSelectedTag
        };

        return (
          <GiftCardUpdateFormContext.Provider value={providerValues}>
            {children}
          </GiftCardUpdateFormContext.Provider>
        );
      }}
    </Form>
  );
};

export default GiftCardUpdateFormProvider;
