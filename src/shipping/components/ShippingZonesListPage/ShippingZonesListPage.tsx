import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { Backlink } from "@dashboard/components/Backlink";
import PageHeader from "@dashboard/components/PageHeader";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { configurationMenuUrl } from "@dashboard/configuration";
import {
  PermissionEnum,
  ShippingZoneFragment,
  WeightUnitsEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import {
  ListActions,
  PageListProps,
  UserPermissionProps,
} from "@dashboard/types";
import React from "react";
import { useIntl } from "react-intl";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";
import ShippingZonesList from "../ShippingZonesList";

export interface ShippingZonesListPageProps
  extends PageListProps,
    ListActions,
    UserPermissionProps {
  defaultWeightUnit: WeightUnitsEnum;
  shippingZones: ShippingZoneFragment[];
  onRemove: (id: string) => void;
  onSubmit: (unit: WeightUnitsEnum) => SubmitPromise;
}

const ShippingZonesListPage: React.FC<ShippingZonesListPageProps> = ({
  defaultWeightUnit,
  disabled,
  onSubmit,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <DetailedContent>
      <Content>
        <Backlink href={configurationMenuUrl}>
          {intl.formatMessage(sectionNames.configuration)}
        </Backlink>
        <PageHeader
          title={intl.formatMessage({
            id: "uULcph",
            defaultMessage: "Shipping",
            description: "header",
          })}
        />
        <ShippingZonesList disabled={disabled} {...listProps} />
      </Content>
      <RightSidebar>
        <RequirePermissions
          requiredPermissions={[PermissionEnum.MANAGE_SETTINGS]}
        >
          <ShippingWeightUnitForm
            defaultWeightUnit={defaultWeightUnit}
            disabled={disabled}
            onSubmit={onSubmit}
          />
        </RequirePermissions>
      </RightSidebar>
    </DetailedContent>
  );
};
ShippingZonesListPage.displayName = "ShippingZonesListPage";
export default ShippingZonesListPage;
