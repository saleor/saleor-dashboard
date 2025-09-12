// @ts-strict-ignore
import AddressFormatter from "@dashboard/components/AddressFormatter";
import { DashboardCard } from "@dashboard/components/Card";
import { AddressFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { EditIcon } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface CustomerAddressChoiceCardProps {
  address: AddressFragment;
  selected?: boolean;
  editable?: boolean;
  onSelect?: () => void;
  onEditClick?: () => void;
}

const CustomerAddressChoiceCard = (props: CustomerAddressChoiceCardProps) => {
  const { address, selected, editable, onSelect, onEditClick } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard
      className={clsx(classes.card, {
        [classes.cardSelected]: selected,
        [classes.selectableCard]: !editable && !selected,
      })}
      onClick={onSelect}
    >
      <DashboardCard.Content className={classes.cardContent}>
        <AddressFormatter address={address} />
        {editable && (
          <div onClick={onEditClick}>
            <EditIcon
              className={classes.editIcon}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
        )}
        {selected && (
          <Text color="default1" className={classes.selectedLabel}>
            {intl.formatMessage(commonMessages.selected)}
          </Text>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerAddressChoiceCard.displayName = "CustomerAddressChoiceCard";
export default CustomerAddressChoiceCard;
