import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AddressFormatter from "@saleor/components/AddressFormatter";
import classNames from "classnames";
import React from "react";

import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";
import { useStyles } from "./styles";

export interface CustomerAddressChoiceProps {
  address: CustomerAddresses_user_addresses;
  selected: boolean;
  onSelect: () => void;
}

const CustomerAddressChoice: React.FC<CustomerAddressChoiceProps> = props => {
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
CustomerAddressChoice.displayName = "CustomerAddressChoice";
export default CustomerAddressChoice;
