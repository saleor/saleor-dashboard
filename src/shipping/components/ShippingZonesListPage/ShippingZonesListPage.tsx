import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
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
import {
  PageListProps,
  SearchPageProps,
  UserPermissionProps,
} from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";
import { ShippingZoneListDatagrid } from "../ShippingZonesListDatagrid";
import { messages } from "./messages";

export interface ShippingZonesListPageProps
  extends PageListProps,
    SearchPageProps,
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
  initialSearch,
  onSearchChange,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <DetailPageLayout withSavebar={false}>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(messages.shippingZonesHeader)}
      >
        <Button href={shippingZoneAddUrl} data-test-id="add-shipping-zone">
          <FormattedMessage {...messages.createShippingZone} />
        </Button>
      </TopNav>
      <DetailPageLayout.Content>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingX={6}
          marginY={2}
        >
          <Box __width="320px">
            <SearchInput
              initialSearch={initialSearch}
              placeholder={intl.formatMessage(messages.searchShippingZones)}
              onSearchChange={onSearchChange}
            />
          </Box>
          {selectedShippingZonesIds.length > 0 && (
            <BulkDeleteButton onClick={onRemove}>
              <FormattedMessage {...messages.bulkDelete} />
            </BulkDeleteButton>
          )}
        </Box>
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
