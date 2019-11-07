import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import React from "react";
import { useIntl } from "react-intl";

export interface FilterCardProps {
  handleClear();
}

const FilterCard: React.FC<FilterCardProps> = ({ children, handleClear }) => {
  const intl = useIntl();

  return (
    <Card>
      <form>
        <CardHeader
          action={
            <IconButton onClick={handleClear}>
              <RefreshIcon />
            </IconButton>
          }
          title={intl.formatMessage({
            defaultMessage: "Filters"
          })}
        />
        <CardContent>{children}</CardContent>
      </form>
    </Card>
  );
};
FilterCard.displayName = "FilterCard";
export default FilterCard;
