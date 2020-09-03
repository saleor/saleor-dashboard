import VisibilityCard, {
  VisibilityCardProps
} from "@saleor/components/VisibilityCard";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import React from "react";
import { useIntl } from "react-intl";

interface AvailabilityCardProps extends VisibilityCardProps {
  data: {
    availableForPurchase: string;
    isAvailableForPurchase: boolean;
    isPublished: boolean;
    publicationDate: string;
    visibleInListings: boolean;
  };
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = props => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  return (
    <VisibilityCard
      {...props}
      messages={{
        ...props.messages,
        availableLabel: intl.formatMessage({
          defaultMessage: "Available for purchase",
          description: "product availability"
        }),
        availableSecondLabel: intl.formatMessage(
          {
            defaultMessage: "will become available on {date}",
            description: "product available for purchase date"
          },
          {
            date: localizeDate(props.data.availableForPurchase, "L")
          }
        ),
        setAvailabilityDateLabel: intl.formatMessage({
          defaultMessage: "Set availability date",
          description: "product availability date label"
        }),
        unavailableLabel: intl.formatMessage({
          defaultMessage: "Unavailable for purchase",
          description: "product unavailability"
        })
      }}
    />
  );
};

export default AvailabilityCard;
