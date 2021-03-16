import { ClickAwayListener } from "@material-ui/core";
import { ChannelDetailsContextConsumerProps } from "@saleor/channels/pages/ChannelDetailsPage/ChannelDetailsProvider/ChannelDetailsProvider";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import CardAddItemsFooter from "@saleor/products/components/ProductStocks/CardAddItemsFooter";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React, { useEffect, useState } from "react";
import { defineMessages } from "react-intl";

const messages = defineMessages({
  addZoneTitle: {
    defaultMessage: "Add Shipping Zones",
    description: "add shipping zone title"
  }
});

interface ShippingZonesCardListFooterProps
  extends ChannelDetailsContextConsumerProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const ShippingZonesCardListFooter: React.FC<ShippingZonesCardListFooterProps> = ({
  containerRef,
  shippingZonesChoices,
  searchShippingZones,
  fetchMoreShippingZones,
  addShippingZone,
  shippingZones
}) => {
  const [isChoicesSelectShown, setIsChoicesSelectShown] = useState<boolean>(
    false
  );

  // select holds value and displays it so it needs remounting to display empty input
  useEffect(() => {
    setIsChoicesSelectShown(true);
  }, [shippingZones]);

  const handleChoice = ({ target }) => {
    setIsChoicesSelectShown(false);
    addShippingZone(target.value);
  };

  return isChoicesSelectShown ? (
    <ClickAwayListener onClickAway={() => setIsChoicesSelectShown(false)}>
      <div ref={containerRef}>
        <SingleAutocompleteSelectField
          value=""
          displayValue=""
          useNakedInput
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
