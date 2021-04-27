import { Card } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { sectionNames } from "@saleor/intl";
import React, { ReactNode } from "react";
import { useIntl } from "react-intl";

interface PluginDetailsChannelsCardContainerProps {
  children: ReactNode | ReactNode[];
}

const PluginDetailsChannelsCardContainer: React.FC<PluginDetailsChannelsCardContainerProps> = ({
  children
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(sectionNames.channels)} />
      {children}
    </Card>
  );
};

export default PluginDetailsChannelsCardContainer;
