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
import {
  ListActions,
  PageListProps,
  UserPermissionProps,
} from "@dashboard/types";
import React from "react";
import { useIntl } from "react-intl";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";
import { ShippingZoneListDatagrid } from "../ShippingZonesListDatagrid";

export interface ShippingZonesListPageProps
  extends PageListProps,
    ListActions,
    UserPermissionProps {
  defaultWeightUnit: WeightUnitsEnum | undefined;
  shippingZones: ShippingZoneFragment[] | undefined;
  onRemove: (id: string) => void;
  onSubmit: (unit: WeightUnitsEnum | undefined) => SubmitPromise;
}

const ShippingZonesListPage: React.FC<ShippingZonesListPageProps> = ({
  defaultWeightUnit,
  disabled,
  onSubmit,
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
      />
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
