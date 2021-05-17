import { Card, CardContent } from "@material-ui/core";
import AddressFormatter from "@saleor/components/AddressFormatter";
import classNames from "classnames";
import React from "react";

import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";
import { useStyles } from "./styles";

export interface CustomerAddressChoiceCardProps {
  address: CustomerAddresses_user_addresses;
  selected: boolean;
  onSelect: () => void;
}

const CustomerAddressChoiceCard: React.FC<CustomerAddressChoiceCardProps> = props => {
  const { address, selected, onSelect } = props;
  const classes = useStyles(props);

  return (
    <Card
      className={classNames(classes.card, {
        [classes.cardSelected]: selected
      })}
      onClick={onSelect}
    >
      <CardContent>
        <AddressFormatter address={address} />
      </CardContent>
    </Card>
  );
};
CustomerAddressChoiceCard.displayName = "CustomerAddressChoiceCard";
export default CustomerAddressChoiceCard;
