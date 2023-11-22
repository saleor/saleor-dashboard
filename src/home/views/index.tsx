// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useHomeQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { getUserName } from "../../misc";
import HomePage from "../components/HomePage";

const HomeSection = () => {
  const { user } = useUser();
  const { channel } = useAppChannel();

  const noChannel = !channel && typeof channel !== "undefined";

  const userPermissions = user?.userPermissions || [];

  const { data } = useHomeQuery({
    displayLoader: true,
    skip: noChannel,
    variables: {
      channel: channel?.slug,
      hasPermissionToManageOrders: hasPermissions(userPermissions, [
        PermissionEnum.MANAGE_ORDERS,
      ]),
      hasPermissionToManageProducts: hasPermissions(userPermissions, [
        PermissionEnum.MANAGE_PRODUCTS,
      ]),
    },
  });

  return (
    <HomePage
      activities={mapEdgesToItems(data?.activities)?.reverse()}
      sales={data?.salesToday?.gross}
      topProducts={mapEdgesToItems(data?.productTopToday)}
      productsOutOfStock={data?.productsOutOfStock.totalCount}
      userName={getUserName(user, true)}
      noChannel={noChannel}
    />
  );
};

export default HomeSection;
