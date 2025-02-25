import { ReactNode } from "react";

import { DashboardCard } from "../Card";

interface AlertCardProps {
  children?: ReactNode | ReactNode[];
}

const AlertCard = ({ children }: AlertCardProps) => (
  <DashboardCard backgroundColor="critical1" padding={4}>
    {children}
  </DashboardCard>
);

export default AlertCard;
