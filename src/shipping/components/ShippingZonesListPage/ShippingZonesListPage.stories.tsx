import {
  adminUserPermissions,
  listActionsProps,
  pageListProps,
} from "@dashboard/fixtures";
import { WeightUnitsEnum } from "@dashboard/graphql";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { shippingZones } from "../../fixtures";
import ShippingZonesListPage, {
  ShippingZonesListPageProps,
} from "./ShippingZonesListPage";

const props: ShippingZonesListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  defaultWeightUnit: WeightUnitsEnum.KG,
  onRemove: () => undefined,
  onSubmit: async () => undefined,
  shippingZones,
  userPermissions: adminUserPermissions,
  selectedShippingZonesIds: [],
  onSelectShippingZones: () => undefined,
  onWeightUnitChange: () => undefined,
  initialSearch: "",
  onSearchChange: () => undefined,
};

export default {
  title: "Shipping / Shipping zones list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <ShippingZonesListPage {...props} />;

export const Loading = () => (
  <ShippingZonesListPage {...props} disabled={true} shippingZones={undefined} />
);

export const NoData = () => (
  <ShippingZonesListPage {...props} shippingZones={[]} />
);

export const NoSiteSettingsPermissions = () => (
  <ShippingZonesListPage {...props} userPermissions={[]} />
);
