import CheckIcon from "@assets/images/check.svg";
import { SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { messages } from "@dashboard/extensions/messages";
import { Text } from "@saleor/macaw-ui-next";
import SVG from "react-inlinesvg";
import { useIntl } from "react-intl";

export const InstalledBadge = () => {
  const intl = useIntl();

  return (
    <Text
      __color={SUCCESS_ICON_COLOR}
      display="flex"
      alignItems="center"
      fontSize={2}
      gap={1}
      fontWeight="medium"
    >
      <SVG src={CheckIcon} />
      {intl.formatMessage(messages.installed)}
    </Text>
  );
};
