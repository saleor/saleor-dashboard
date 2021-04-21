import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AddressFormatter from "@saleor/components/AddressFormatter";
import useTheme from "@saleor/hooks/useTheme";
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
      cursor: "pointer"
    },
    cardSelectedLight: {
      borderColor: theme.palette.primary.light,
      borderWidth: "2px"
    },
    cardSelectedDark: {
      borderColor: theme.palette.primary.dark,
      borderWidth: "2px"
    }
  }),
  { name: "CustomerAddressChoice" }
);
const CustomerAddressChoice: React.FC<CustomerAddressChoiceProps> = props => {
  const { address, selected, onSelect } = props;
  const { isDark } = useTheme();
  const classes = useStyles(props);

  return (
    <Card
      className={classNames(classes.card, {
        [classes.cardSelectedLight]: selected && !isDark,
        [classes.cardSelectedDark]: selected && isDark
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
