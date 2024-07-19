import React from "react";

import { DashboardCard } from "../Card";

interface AlertCardProps {
  children?: React.ReactNode | React.ReactNode[];
}

const AlertCard: React.FC<AlertCardProps> = ({ children }) => (
  <DashboardCard backgroundColor="critical1" padding={4}>
    {children}
  </DashboardCard>
);

export default AlertCard;
