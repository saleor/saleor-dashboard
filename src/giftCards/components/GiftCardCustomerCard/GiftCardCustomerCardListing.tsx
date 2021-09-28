import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import CardMenu from "@saleor/components/CardMenu";

interface GiftCardCustomerCardListingProps {}

const GiftCardCustomerCardListing: React.FC<GiftCardCustomerCardListingProps> = ({}) => {
  const intl = useIntl();

  return (
    <>
      <FormattedMessage defaultMessage="Code ending with XXXX" />
      <CardMenu
        menuItems={[
          {
            label: intl.formatMessage({
              defaultMessage: "Delete",
              description: "button"
            }),
            onSelect: () => console.log("Delete")
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Actiavte",
              description: "button"
            }),
            onSelect: () => console.log("Activate")
          }
        ]}
      />
    </>
  );
};

export default GiftCardCustomerCardListing;
