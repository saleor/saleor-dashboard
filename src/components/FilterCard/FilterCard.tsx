// @ts-strict-ignore
import { CardHeader } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { IconButton } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { DashboardCard } from "../Card";

export interface FilterCardProps {
  handleClear: () => any;
}

const FilterCard = ({ children, handleClear }: FilterCardProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <form>
        <CardHeader
          action={
            <IconButton variant="secondary" onClick={handleClear}>
              <RefreshIcon />
            </IconButton>
          }
          title={intl.formatMessage({
            id: "zSOvI0",
            defaultMessage: "Filters",
          })}
        />
        <DashboardCard.Content>{children}</DashboardCard.Content>
      </form>
    </DashboardCard>
  );
};

FilterCard.displayName = "FilterCard";
export default FilterCard;
