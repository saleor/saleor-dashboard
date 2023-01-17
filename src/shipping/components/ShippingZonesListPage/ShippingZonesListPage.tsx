import { Backlink } from "@dashboard/components/Backlink";
import Container from "@dashboard/components/Container";
import Grid from "@dashboard/components/Grid";
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
    <Container>
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
      <Grid>
        <div>
          <ShippingZonesList disabled={disabled} {...listProps} />
        </div>
        <div>
          <RequirePermissions
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
