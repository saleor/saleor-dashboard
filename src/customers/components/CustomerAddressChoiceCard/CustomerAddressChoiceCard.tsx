import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import {
  getBgColor,
  getBorderColor,
  getHoverStateBgColor,
} from "@dashboard/components/RadioTiles/utils";
import { ReadonlyAddress } from "@dashboard/components/ReadonlyAddress/ReadonlyAddress";
import { type AddressFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Pencil } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

import styles from "./CustomerAddressChoiceCard.module.css";

interface CustomerAddressChoiceCardProps {
  address: AddressFragment;
  selected?: boolean;
  editable?: boolean;
  onSelect?: () => void;
  onEditClick?: () => void;
}

interface AddressSelectionIndicatorProps {
  checked: boolean;
  isHoverState: boolean;
}

const AddressSelectionIndicator = ({ checked, isHoverState }: AddressSelectionIndicatorProps) => (
  <Box
    width={5}
    height={5}
    borderRadius="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    __flexShrink={0}
    __marginTop={0.5}
    backgroundColor={getHoverStateBgColor({ checked, isHoverState })}
  >
    <Box
      width={3}
      height={3}
      boxShadow={checked || isHoverState ? "none" : "defaultFocused"}
      borderColor="default1"
      borderWidth={1}
      borderStyle={checked ? "none" : "solid"}
      borderRadius="100%"
      backgroundColor={getBgColor({ checked, isHoverState })}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {checked ? (
        <Box width={1.5} height={1.5} borderRadius="100%" backgroundColor="default1" />
      ) : null}
    </Box>
  </Box>
);

export const CustomerAddressChoiceCard = ({
  address,
  selected = false,
  editable = false,
  onSelect,
  onEditClick,
}: CustomerAddressChoiceCardProps) => {
  const [isHoverState, setHoverState] = useState(false);
  const isSelectable = onSelect != null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isSelectable || !onSelect) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <Box
      className={clsx(styles.card, isSelectable && styles.cardSelectable)}
      display="grid"
      __gridTemplateColumns={isSelectable ? "auto 1fr auto" : editable ? "1fr auto" : "1fr"}
      gap={3}
      alignItems="start"
      borderColor={getBorderColor({ checked: selected, isHoverState })}
      borderWidth={1}
      borderStyle="solid"
      borderRadius={4}
      padding={4}
      backgroundColor="default1"
      onClick={isSelectable ? onSelect : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      data-test-id="customer-address-choice-card"
    >
      {isSelectable ? (
        <AddressSelectionIndicator checked={selected} isHoverState={isHoverState} />
      ) : null}

      <ReadonlyAddress address={address} variant="compact" />

      {editable ? (
        <button
          type="button"
          className={styles.editButton}
          onClick={event => {
            event.stopPropagation();
            onEditClick?.();
          }}
          aria-label="Edit address"
        >
          <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
        </button>
      ) : null}
    </Box>
  );
};

CustomerAddressChoiceCard.displayName = "CustomerAddressChoiceCard";
