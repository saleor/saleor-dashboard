import errorImg from "@assets/images/app-install-error.svg";
import { Box, Button, sprinkles, Text } from "@saleor/macaw-ui-next";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import messages from "./messages";

interface AppInstallErrorPageProps {
  onBack: () => void;
}

export const AppInstallErrorPage = ({ onBack }: AppInstallErrorPageProps) => {
  return (
    <Box alignItems="center" display="flex" height="100vh">
      <Box
        display="grid"
        gridTemplateColumns={{
          mobile: 1,
          tablet: 1,
          desktop: 2,
        }}
        __margin="0 auto"
        gap={4}
        padding={4}
      >
        <SVG className={sprinkles({ width: "100%" })} src={errorImg} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          textAlign={{
            mobile: "center",
            tablet: "center",
            desktop: "left",
          }}
          gap={10}
        >
          <Box>
            <Text size={11} fontWeight="bold">
              <FormattedMessage {...messages.title} />
            </Text>
            <Text display="block" marginTop={4}>
              <FormattedMessage {...messages.content} />
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            justifyContent={{
              mobile: "center",
              tablet: "center",
              desktop: "flex-start",
            }}
          >
            <Button variant="primary" onClick={onBack}>
              <FormattedMessage {...messages.backButton} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
