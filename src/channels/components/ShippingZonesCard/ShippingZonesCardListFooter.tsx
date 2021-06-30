import { ClickAwayListener } from "@material-ui/core";
import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import CardAddItemsFooter from "@saleor/products/components/ProductStocks/CardAddItemsFooter";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React, { useEffect, useRef, useState } from "react";
import { defineMessages } from "react-intl";

import { ShippingZonesProps } from "./types";

const messages = defineMessages({
  addZoneTitle: {
    defaultMessage: "Add Shipping Zones",
    description: "add shipping zone title"
  }
});

type ShippingZonesCardListFooterProps = ShippingZonesProps;

const ShippingZonesCardListFooter: React.FC<ShippingZonesCardListFooterProps> = ({
  shippingZonesChoices,
  searchShippingZones,
  fetchMoreShippingZones,
  addShippingZone,
  shippingZones
}) => {
  const [isChoicesSelectShown, setIsChoicesSelectShown] = useState(false);
  const shippingZonesRef = useRef<ChannelShippingZones>(shippingZones);

  // select holds value and displays it so it needs remounting
  // to display empty input after adding new zone
  useEffect(() => {
    if (shippingZones.length > shippingZonesRef.current.length) {
      setIsChoicesSelectShown(true);
    }

    shippingZonesRef.current = shippingZones;
  }, [shippingZones]);

  const handleChoice = ({ target }) => {
    setIsChoicesSelectShown(false);
    addShippingZone(target.value);
  };

  const handleFooterClickAway = () => {
    setIsChoicesSelectShown(false);
    searchShippingZones("");
  };

  return isChoicesSelectShown ? (
    <ClickAwayListener onClickAway={handleFooterClickAway}>
      <div>
        <SingleAutocompleteSelectField
          data-test-id="shippingAutoCompleteSelect"
          value=""
          displayValue=""
          nakedInput
          name="shippingZone"
          choices={mapNodeToChoice(shippingZonesChoices)}
          fetchChoices={searchShippingZones}
          onChange={handleChoice}
          {...fetchMoreShippingZones}
        />
      </div>
    </ClickAwayListener>
  ) : (
    <CardAddItemsFooter
      onAdd={() => setIsChoicesSelectShown(true)}
      title={messages.addZoneTitle}
      testIds={{
        link: "add-shipping-zone-link",
        button: "add-shipping-zone-button"
      }}
    />
  );
};

export default ShippingZonesCardListFooter;
