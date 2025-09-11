import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export const NoFlags = () => (
  <Box
    width="100%"
    display="flex"
    justifyContent="center"
    borderWidth={1}
    borderStyle="solid"
    borderTopWidth={1}
    borderColor="default1"
    paddingTop={52}
  >
    <Text color="defaultDisabled" size={5}>
      <FormattedMessage
        id="pEf/m+"
        defaultMessage="There are no previews at the moment. Stay tuned!"
      />
    </Text>
  </Box>
);
