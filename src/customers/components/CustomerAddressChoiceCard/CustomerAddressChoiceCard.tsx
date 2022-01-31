import { Card, CardContent, Typography } from "@material-ui/core";
import AddressFormatter from "@saleor/components/AddressFormatter";
import { commonMessages } from "@saleor/intl";
import { EditIcon } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";
import { useStyles } from "./styles";

export interface CustomerAddressChoiceCardProps {
  address: CustomerAddresses_user_addresses;
  selected?: boolean;
  editable?: boolean;
  onSelect?: () => void;
  onEditClick?: () => void;
}

const CustomerAddressChoiceCard: React.FC<CustomerAddressChoiceCardProps> = props => {
  const { address, selected, editable, onSelect, onEditClick } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card
      className={classNames(classes.card, {
        [classes.cardSelected]: selected,
        [classes.selectableCard]: !editable && !selected
      })}
      onClick={onSelect}
    >
      <CardContent className={classes.cardContent}>
        <AddressFormatter address={address} />
        {editable && (
          <div onClick={onEditClick}>
            <EditIcon className={classes.editIcon} />
          </div>
        )}
        {selected && (
          <Typography color="primary" className={classes.selectedLabel}>
            {intl.formatMessage(commonMessages.selected)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
CustomerAddressChoiceCard.displayName = "CustomerAddressChoiceCard";
export default CustomerAddressChoiceCard;
