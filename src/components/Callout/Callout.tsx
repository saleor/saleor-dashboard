import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

import { DashboardCard } from "../Card";

type CalloutType = "info" | "warning";

const warningStylesBox = {
  backgroundColor: "warning1",
  borderColor: "warning1",
} as const;

const warningStylesIcon = {
  color: "warning1",
} as const;

const gridTemplate = `
  "icon title"
  "empty content"
`;

export const Callout = ({
  children,
  title,
  type,
}: {
  children: ReactNode;
  title: ReactNode;
  type: CalloutType;
}) => {
  const boxStyles = type === "warning" ? warningStylesBox : null;
  const iconStyles = type === "warning" ? warningStylesIcon : null;

  return (
    <DashboardCard
      display="grid"
      __gridTemplateColumns="auto 1fr"
      __gridTemplateRows="auto auto"
      __gridTemplateAreas={gridTemplate}
      withBorder
      rowGap={1}
      columnGap={2}
      __width="fit-content"
      {...boxStyles}
    >
      <DashboardCard.Title display="contents">
        <Box __lineHeight="0" __gridArea="icon" {...iconStyles}>
          <ExclamationIcon width="20" height="20" />
        </Box>
        <Box __gridArea="title">{title}</Box>
      </DashboardCard.Title>
      <DashboardCard.Content __gridArea="content" fontSize={3} paddingRight={0} paddingLeft={0}>
        {children}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
