import { Button, Card, CardContent } from "@material-ui/core";
import AddressFormatter from "@saleor/components/AddressFormatter";
import classNames from "classnames";
import React from "react";

import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";
import { useStyles } from "./styles";

export interface CustomerAddressChoiceCardProps {
  address: CustomerAddresses_user_addresses;
  selected?: boolean;
  editable?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
}

const CustomerAddressChoiceCard: React.FC<CustomerAddressChoiceCardProps> = props => {
  const { address, selected, editable, onSelect, onEdit } = props;
  const classes = useStyles(props);

  return (
    <Card
      className={classNames(classes.card, { [classes.cardSelected]: selected })}
    >
      <CardContent className={classes.cardContent}>
        <AddressFormatter address={address} />
        {editable && (
          <Button color="primary" onClick={onEdit}>
            Edit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
CustomerAddressChoiceCard.displayName = "CustomerAddressChoiceCard";
export default CustomerAddressChoiceCard;
