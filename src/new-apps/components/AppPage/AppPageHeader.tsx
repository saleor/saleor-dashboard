import { topBarHeight } from "@dashboard/components/AppLayout/consts";
import { AppQuery } from "@dashboard/graphql";
import { GitHub, OfflineBoltOutlined } from "@material-ui/icons";
import { ArrowLeftIcon, Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";
import useRouter from "use-react-router";

interface AppPageHeaderProps {
  name: AppQuery["app"]["name"];
  supportUrl: AppQuery["app"]["supportUrl"];
  homepageUrl: AppQuery["app"]["homepageUrl"];
}

export const AppPageHeader: React.FC<AppPageHeaderProps> = ({
  name,
  supportUrl,
  homepageUrl,
}) => {
  const { history } = useRouter();

  return (
    <Box
      __gridArea="nav"
      data-test-id="page-header"
      __height={topBarHeight}
      display="flex"
      alignItems="center"
      paddingX={9}
      paddingY={8}
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderColor="neutralPlain"
    >
      <Box display="flex" gap={7}>
        <Button
          onClick={() => history.goBack()}
          icon={<ArrowLeftIcon />}
          variant="secondary"
          size="large"
          data-test-id="app-header-back-button"
        />
        <Box display="flex" gap={5} alignItems="center">
          <Box
            width={13}
            height={13}
            display="flex"
            placeItems="center"
            borderRadius={3}
            backgroundColor="decorativeSurfacePlain2"
            data-test-id="app-logo"
          >
            <Text
              variant="bodyEmp"
              size="large"
              data-test-id="app-logo-placeholder"
              color="textNeutralContrasted"
            >
              {name.charAt(0).toUpperCase()}
            </Text>
          </Box>
          <Text variant="heading">{name}</Text>
        </Box>
      </Box>

      <Box display="flex" gap={4}>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => {
            window.open(supportUrl, "_blank");
          }}
        >
          <GitHub />
          <FormattedMessage defaultMessage="Repository" id="UxeJFE" />
        </Button>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => {
            window.open(homepageUrl, "_blank");
          }}
        >
          <OfflineBoltOutlined />
          <FormattedMessage defaultMessage="Request a feature" id="tDlWb6" />
        </Button>
      </Box>
    </Box>
  );
};
