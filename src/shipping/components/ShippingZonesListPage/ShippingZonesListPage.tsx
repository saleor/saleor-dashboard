import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import RequirePermissions from "@saleor/components/RequirePermissions";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps, UserPermissionProps } from "@saleor/types";
import { PermissionEnum, WeightUnitsEnum } from "@saleor/types/globalTypes";
import { ShippingZoneFragment } from "../../types/ShippingZoneFragment";
import ShippingWeightUnitForm from "../ShippingWeightUnitForm";
import ShippingZonesList from "../ShippingZonesList";

export interface ShippingZonesListPageProps
  extends PageListProps,
    ListActions,
    UserPermissionProps {
  defaultWeightUnit: WeightUnitsEnum;
  shippingZones: ShippingZoneFragment[];
  onBack: () => void;
  onRemove: (id: string) => void;
  onSubmit: (unit: WeightUnitsEnum) => void;
}

const ShippingZonesListPage: React.StatelessComponent<
  ShippingZonesListPageProps
> = ({
  defaultWeightUnit,
  disabled,
  userPermissions,
  onBack,
  onSubmit,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader
        title={intl.formatMessage({
          defaultMessage: "Shipping",
          description: "header"
        })}
      />
      <Grid>
        <div>
          <ShippingZonesList disabled={disabled} {...listProps} />
        </div>
        <div>
          <RequirePermissions
            userPermissions={userPermissions}
            requiredPermissions={[PermissionEnum.MANAGE_SETTINGS]}
          >
            <ShippingWeightUnitForm
              defaultWeightUnit={defaultWeightUnit}
              disabled={disabled}
              onSubmit={onSubmit}
            />
          </RequirePermissions>
        </div>
      </Grid>
    </Container>
  );
};
ShippingZonesListPage.displayName = "ShippingZonesListPage";
export default ShippingZonesListPage;
