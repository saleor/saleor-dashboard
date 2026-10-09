import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { DetailSettingRadioGroup } from "@dashboard/components/DetailSettingRadioGroup/DetailSettingRadioGroup";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailSettingToggleRow } from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { messages } from "@dashboard/warehouses/messages";
import { pickupOptionWhenEnabled } from "@dashboard/warehouses/pickupOptionAfterPrivateChange";
import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface WarehousePickupCardProps {
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
  /** Restored when pickup is switched back on. */
  savedClickAndCollectOption: WarehouseClickAndCollectOptionEnum;
  disabled: boolean;
  onOptionChange: (option: WarehouseClickAndCollectOptionEnum) => void;
}

export const WarehousePickupCard = ({
  clickAndCollectOption,
  savedClickAndCollectOption,
  disabled,
  onOptionChange,
}: WarehousePickupCardProps): ReactNode => {
  const pickupEnabled = clickAndCollectOption !== WarehouseClickAndCollectOptionEnum.DISABLED;

  const handlePickupChange = (enabled: boolean): void => {
    onOptionChange(
      enabled
        ? pickupOptionWhenEnabled(savedClickAndCollectOption)
        : WarehouseClickAndCollectOptionEnum.DISABLED,
    );
  };

  return (
    <DetailSettingsCard
      title={<FormattedMessage {...messages.pickupTitle} />}
      contentFlush
      data-test-id="warehouse-pickup-section"
    >
      <DetailSettingToggleRow
        testId="warehouse-pickup-toggle"
        title={<FormattedMessage {...messages.pickupToggleTitle} />}
        description={
          <FormattedMessage
            {...(pickupEnabled
              ? messages.pickupToggleOnDescription
              : messages.pickupToggleOffDescription)}
          />
        }
        pressed={pickupEnabled}
        disabled={disabled}
        onPressedChange={handlePickupChange}
      />
      {pickupEnabled ? (
        <DetailGroupBox
          groupId="warehouse-pickup-advanced"
          variant="flush"
          tintExpandedHeader={false}
          dataTestId="warehouse-pickup-advanced"
          headerStart={
            <Text size={3} fontWeight="medium">
              <FormattedMessage {...messages.pickupAdvanced} />
            </Text>
          }
        >
          <DetailSettingRadioGroup
            name="clickAndCollectOption"
            testId="warehouse-pickup"
            title={<FormattedMessage {...messages.pickupChoiceTitle} />}
            description={<FormattedMessage {...messages.pickupChoiceDescription} />}
            value={clickAndCollectOption}
            disabled={disabled}
            onValueChange={onOptionChange}
            options={[
              {
                value: WarehouseClickAndCollectOptionEnum.LOCAL,
                label: <FormattedMessage {...messages.pickupLocal} />,
                description: <FormattedMessage {...messages.pickupLocalDescription} />,
              },
              {
                value: WarehouseClickAndCollectOptionEnum.ALL,
                label: <FormattedMessage {...messages.pickupAll} />,
                description: <FormattedMessage {...messages.pickupAllDescription} />,
              },
            ]}
          />
        </DetailGroupBox>
      ) : null}
    </DetailSettingsCard>
  );
};

WarehousePickupCard.displayName = "WarehousePickupCard";
