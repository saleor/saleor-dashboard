import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import React, { ReactNode } from "react";

import { DashboardCard } from "../Card";

type CalloutType = "info" | "warning";

export const Callout = ({
  children,
  title,
  type,
}: {
  children: ReactNode;
  title: ReactNode;
  type: CalloutType;
}) => {
  const icon = type === "warning" ? <ExclamationIcon /> : <ExclamationIcon />;

  const styles = type === "warning" ? {} : {};

  return (
    <DashboardCard withBorder gap={1} __width="fit-content">
      <DashboardCard.Title display="flex" gap={2} alignItems="center">
        {icon}
        {title}
      </DashboardCard.Title>
      <DashboardCard.Content fontSize={3} paddingRight={0}>
        {children}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
