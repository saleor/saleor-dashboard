import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AddressFormatter from "@saleor/components/AddressFormatter";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";

import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";

export interface CustomerAddressChoiceProps {
  address: CustomerAddresses_user_addresses;
  selected: boolean;
  onSelect: () => void;
}

const useStyles = makeStyles(
  theme => ({
    card: {
      cursor: "pointer",
      padding: "1px"
    },
    cardSelected: {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
      padding: "0"
    }
  }),
  { name: "CustomerAddressChoice" }
);
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
