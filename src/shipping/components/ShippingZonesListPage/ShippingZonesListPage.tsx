import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { configurationMenuUrl } from "@dashboard/configuration";
import { PermissionEnum, ShippingZoneFragment, WeightUnitsEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { shippingZoneAddUrl } from "@dashboard/shipping/urls";
import { PageListProps, SearchPageProps, UserPermissionProps } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
  onWeightUnitChange: () => void;
}

const ShippingZonesListPage: React.FC<ShippingZonesListPageProps> = ({
  defaultWeightUnit,
  disabled,
  onSubmit,
  onRemove,
  selectedShippingZonesIds,
  initialSearch,
  onSearchChange,
  onWeightUnitChange,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(messages.shippingZonesHeader)}
        withoutBorder
      >
        <Box display="flex" alignItems="end" gap={2}>
          <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_SETTINGS]}>
            <TopNav.Menu
              dataTestId="shipping-zones-menu"
              items={[
                {
                  label: intl.formatMessage(messages.shippingZonesConfig),
                  onSelect: onWeightUnitChange,
                  testId: "weight-unit-configuration",
                },
              ]}
            />
          </RequirePermissions>
          <Button data-test-id="add-shipping-zone" onClick={() => navigate(shippingZoneAddUrl)}>
            <FormattedMessage {...messages.createShippingZone} />
          </Button>
        </Box>
      </TopNav>
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
    </>
  );
};
ShippingZonesListPage.displayName = "ShippingZonesListPage";
export default ShippingZonesListPage;
