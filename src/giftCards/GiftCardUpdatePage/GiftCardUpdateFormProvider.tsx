import Form from "@saleor/components/Form";
import { UseFormResult } from "@saleor/hooks/useForm";
import { TimePeriodType } from "@saleor/types/globalTypes";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from "react";

import { GiftCardDetailsContext } from "./GiftCardDetailsProvider";
import { GiftCardDetails_giftCard } from "./types/GiftCardDetails";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
}

export interface GiftCardUpdateFormData
  extends Pick<GiftCardDetails_giftCard, "tag" | "expiryDate" | "expiryType"> {
  expiryPeriodType: TimePeriodType;
  expiryPeriodAmount: number;
}

export interface GiftCardUpdateFormConsumerProps
  extends UseFormResult<GiftCardUpdateFormData> {
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  setSelectedTimePeriodType: Dispatch<SetStateAction<TimePeriodType>>;
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
  const [selectedTimePeriodType, setSelectedTimePeriodType] = useState(
    expiryPeriod.type
  );

  const initialData: GiftCardUpdateFormData = {
    tag,
    expiryDate,
    expiryType,
    expiryPeriodType: expiryPeriod.type,
    expiryPeriodAmount: expiryPeriod.amount
  };

  return (
    <Form initial={initialData}>
      {formProps => {
        const providerValues: GiftCardUpdateFormConsumerProps = {
          ...formProps,
          selectedTag,
          setSelectedTag,
          setSelectedTimePeriodType
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
