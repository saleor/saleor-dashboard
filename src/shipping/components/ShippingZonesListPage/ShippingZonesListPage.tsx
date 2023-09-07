import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { configurationMenuUrl } from "@dashboard/configuration";
import {
  PermissionEnum,
  ShippingZoneFragment,
  WeightUnitsEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { shippingZoneAddUrl } from "@dashboard/shipping/urls";
import { PageListProps, UserPermissionProps } from "@dashboard/types";
import { Button, TrashBinIcon } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";
import { ShippingZoneListDatagrid } from "../ShippingZonesListDatagrid";

export interface ShippingZonesListPageProps
  extends PageListProps,
    UserPermissionProps {
  defaultWeightUnit: WeightUnitsEnum | undefined;
  shippingZones: ShippingZoneFragment[] | undefined;
  selectedShippingZonesIds: string[];
  onSelectShippingZones: (rows: number[], clearSelection: () => void) => void;
  onRemove: () => void;
  onSubmit: (unit: WeightUnitsEnum | undefined) => SubmitPromise;
}

const ShippingZonesListPage: React.FC<ShippingZonesListPageProps> = ({
  defaultWeightUnit,
  disabled,
  onSubmit,
  onRemove,
  selectedShippingZonesIds,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <DetailPageLayout withSavebar={false}>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage({
          id: "uULcph",
          defaultMessage: "Shipping",
          description: "header",
        })}
      >
        {selectedShippingZonesIds.length > 0 && (
          <Button
            data-test-id="delete-selected-elements-icon"
            variant="secondary"
            icon={<TrashBinIcon />}
            onClick={onRemove}
            marginRight={2}
          />
        )}
        <Button href={shippingZoneAddUrl} data-test-id="add-shipping-zone">
          <FormattedMessage
            id="mIUNgR"
            defaultMessage="Create shipping zone"
            description="button"
          />
        </Button>
      </TopNav>
      <DetailPageLayout.Content>
        <ShippingZoneListDatagrid disabled={disabled} {...listProps} />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <RequirePermissions
          requiredPermissions={[PermissionEnum.MANAGE_SETTINGS]}
        >
          <ShippingWeightUnitForm
            defaultWeightUnit={defaultWeightUnit}
            disabled={disabled}
            onSubmit={onSubmit}
          />
        </RequirePermissions>
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
ShippingZonesListPage.displayName = "ShippingZonesListPage";
export default ShippingZonesListPage;
