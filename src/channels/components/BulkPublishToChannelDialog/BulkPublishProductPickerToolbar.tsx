import { AssignProductPickerToolbar } from "@dashboard/components/AssignProductDialog/AssignProductPickerToolbar";
import { type AssignProductPicker } from "@dashboard/components/AssignProductDialog/useAssignProductPicker";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import styles from "./BulkPublishProductPickerToolbar.module.css";
import { messages } from "./messages";

interface BulkPublishProductPickerToolbarProps {
  picker: AssignProductPicker;
  excludeListedInChannel: boolean;
  onExcludeListedInChannelChange: (value: boolean) => void;
}

export const BulkPublishProductPickerToolbar = ({
  picker,
  excludeListedInChannel,
  onExcludeListedInChannelChange,
}: BulkPublishProductPickerToolbarProps) => (
  <Box display="flex" flexDirection="column" gap={3}>
    <AssignProductPickerToolbar picker={picker} />
    <Box className={styles.scopeFilter}>
      <ControlledCheckbox
        checked={excludeListedInChannel}
        name="excludeListedInChannel"
        testId="bulk-publish-exclude-listed"
        label={
          <Text size={2} color="default1">
            <FormattedMessage {...messages.excludeListedInChannel} />
          </Text>
        }
        onChange={() => onExcludeListedInChannelChange(!excludeListedInChannel)}
      />
      <Text size={1} color="default2" className={styles.helper}>
        <FormattedMessage {...messages.excludeListedInChannelHelper} />
      </Text>
      <Text size={1} color="default2" className={styles.helper}>
        <FormattedMessage {...messages.excludeMissingCategoryHelper} />
      </Text>
    </Box>
  </Box>
);
