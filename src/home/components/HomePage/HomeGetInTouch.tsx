import { DashboardCard } from "@dashboard/components/Card";
import { Button, HelpIcon, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface HomeGetInTouchCardProps {
  externalHref: string;
}

export const HomeGetInTouchCard: React.FC<HomeGetInTouchCardProps> = ({ externalHref }) => (
  <DashboardCard
    backgroundColor="default2"
    borderStyle="solid"
    borderColor="default1"
    borderRadius={4}
    borderWidth={1}
    margin={4}
    display="flex"
    flexDirection="column"
    gap={4}
  >
    <DashboardCard.Header>
      <DashboardCard.Title display="flex" alignItems="center" gap={3}>
        <HelpIcon />
        <FormattedMessage
          defaultMessage="Need technical help?"
          id="J5R1SI"
          description="home get in touch card title"
        />
      </DashboardCard.Title>
    </DashboardCard.Header>

    <DashboardCard.Content>
      <Text>
        <FormattedMessage
          defaultMessage="Save hours of evaluating Saleor on your own by speaking with our solution engineer."
          id="u0hKaa"
          description="home get in touch card description"
        />
      </Text>
    </DashboardCard.Content>

    <DashboardCard.BottomActions paddingTop={2}>
      <Button as="a" target="_blank" href={externalHref} variant="secondary" alignSelf="start">
        <FormattedMessage
          defaultMessage="Get in touch"
          id="HRXLYk"
          description="cta button label"
        />
      </Button>
    </DashboardCard.BottomActions>
  </DashboardCard>
);
