// @ts-strict-ignore
import AddressFormatter from "@dashboard/components/AddressFormatter";
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { AddressFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Pencil } from "lucide-react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

interface CustomerAddressChoiceCardProps {
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
            <Pencil
              size={iconSize.small}
              strokeWidth={iconStrokeWidthBySize.small}
              className={classes.editIcon}
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
