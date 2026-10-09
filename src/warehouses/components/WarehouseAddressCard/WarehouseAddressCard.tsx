import {
  CompanyAddressForm,
  type CompanyAddressFormProps,
} from "@dashboard/components/CompanyAddressInput/CompanyAddressForm";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { messages } from "@dashboard/warehouses/messages";
import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface WarehouseAddressCardProps extends CompanyAddressFormProps {
  showPickupNotice: boolean;
}

export const WarehouseAddressCard = ({
  showPickupNotice,
  ...formProps
}: WarehouseAddressCardProps): ReactNode => (
  <DetailSettingsCard
    title={<FormattedMessage {...messages.address} />}
    data-test-id="warehouse-address-section"
    intro={
      showPickupNotice ? (
        <Text size={3} color="default2">
          <FormattedMessage {...messages.addressPickupNotice} />
        </Text>
      ) : undefined
    }
  >
    <CompanyAddressForm {...formProps} />
  </DetailSettingsCard>
);

WarehouseAddressCard.displayName = "WarehouseAddressCard";
