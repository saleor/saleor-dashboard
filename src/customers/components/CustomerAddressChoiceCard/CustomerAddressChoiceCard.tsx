import { Button, Card, CardContent, Typography } from "@material-ui/core";
import AddressFormatter from "@saleor/components/AddressFormatter";
import { EditIcon } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";
import { addressChoiceCardMessages as messages } from "./messages";
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

  const intl = useIntl();

  return (
    <Card
      className={classNames(classes.card, { [classes.cardSelected]: selected })}
    >
      <CardContent className={classes.cardContent}>
        <AddressFormatter address={address} />
        {editable && (
          <div onClick={onEdit}>
            <EditIcon className={classes.editIcon} />
          </div>
        )}
        {selected && (
          <Typography color="primary" className={classes.selectedLabel}>
            {intl.formatMessage(messages.selectedLabel)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
CustomerAddressChoiceCard.displayName = "CustomerAddressChoiceCard";
export default CustomerAddressChoiceCard;
