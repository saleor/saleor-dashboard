import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { X } from "lucide-react";
import * as React from "react";

import styles from "./Chip.module.css";

interface ChipProps {
  className?: string;
  label: React.ReactNode;
  onClose?: () => void;
}

const Chip = (props: ChipProps) => {
  const { className, label, onClose } = props;

  return (
    <div className={clsx(styles.root, className)}>
      <Text className={styles.label} size={2} fontWeight="medium">
        {label}
        {onClose && (
          <X
            size={iconSize.small}
            strokeWidth={iconStrokeWidth}
            className={styles.closeIcon}
            onClick={onClose}
          />
        )}
      </Text>
    </div>
  );
};

Chip.displayName = "Chip";
export default Chip;
