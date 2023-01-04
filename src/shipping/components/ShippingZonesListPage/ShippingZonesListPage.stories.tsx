import {
  adminUserPermissions,
  listActionsProps,
  pageListProps,
} from "@saleor/fixtures";
import { WeightUnitsEnum } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { shippingZones } from "../../fixtures";
import ShippingZonesListPage, {
  ShippingZonesListPageProps,
} from "./ShippingZonesListPage";

const props: ShippingZonesListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  defaultWeightUnit: WeightUnitsEnum.KG,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  shippingZones,
  userPermissions: adminUserPermissions,
};

storiesOf("Shipping / Shipping zones list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <ShippingZonesListPage {...props} />)
  .add("loading", () => (
    <ShippingZonesListPage
      {...props}
      disabled={true}
      shippingZones={undefined}
    />
  ))
  .add("no data", () => <ShippingZonesListPage {...props} shippingZones={[]} />)
  .add("no site settings permissions", () => (
    <ShippingZonesListPage {...props} userPermissions={[]} />
  ));
