import { WeightUnitsEnum } from "@saleor/graphql";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  adminUserPermissions,
  listActionsProps,
  pageListProps,
} from "../../../fixtures";
import ShippingZonesListPage, {
  ShippingZonesListPageProps,
} from "../../../shipping/components/ShippingZonesListPage";
import { shippingZones } from "../../../shipping/fixtures";
import Decorator from "../../Decorator";

const props: ShippingZonesListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  defaultWeightUnit: WeightUnitsEnum.KG,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  shippingZones,
  userPermissions: adminUserPermissions,
};

storiesOf("Views / Shipping / Shipping zones list", module)
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
