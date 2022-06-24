import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import RequirePermissions from "@saleor/components/RequirePermissions";
import { configurationMenuUrl } from "@saleor/configuration";
import {
  PermissionEnum,
  ShippingZoneFragment,
  WeightUnitsEnum,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps, UserPermissionProps } from "@saleor/types";
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
