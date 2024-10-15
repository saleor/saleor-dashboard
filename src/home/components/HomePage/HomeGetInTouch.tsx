import { DashboardCard } from "@dashboard/components/Card";
import { TECHNICAL_HELP_CTA_URL } from "@dashboard/links";
import { Box, Button, CloseIcon, HelpIcon, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

export const useGetInTouchCard = () => {
  const storageState = localStorage.getItem("get_in_touch_card_hidden");
  const [hidden, setHidden] = useState(!!storageState);

  const hide = () => {
    setHidden(true);
    localStorage.setItem("get_in_touch_card_hidden", "true");
  };

  return {
    visible: !hidden,
    hide,
  };
};

interface HomeGetInTouchCardProps {
  onCloseClick: () => void;
}

export const HomeGetInTouchCard = ({ onCloseClick }: HomeGetInTouchCardProps) => (
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
      <Box
        onClick={onCloseClick}
        as="button"
        __backgroundColor="transparent"
        borderWidth={0}
        outlineStyle="none"
        cursor="pointer"
      >
        <CloseIcon />
      </Box>
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
      <Button
        as="a"
        target="_blank"
        href={TECHNICAL_HELP_CTA_URL}
        variant="secondary"
        alignSelf="start"
      >
        <FormattedMessage
          defaultMessage="Get in touch"
          id="HRXLYk"
          description="cta button label"
        />
      </Button>
    </DashboardCard.BottomActions>
  </DashboardCard>
);
