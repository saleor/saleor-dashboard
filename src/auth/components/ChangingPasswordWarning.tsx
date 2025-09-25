import { Paragraph } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const ChangingPasswordWarning = () => {
  const intl = useIntl();

  return (
    <Paragraph
      backgroundColor="warning1"
      padding={4}
      borderWidth={1}
      borderColor={"warning1"}
      borderStyle="solid"
      borderRadius={2}
      size={2}
    >
      {intl.formatMessage({
        defaultMessage:
          "You are currently logged in using an external identity provider. Logging in through email and password may result in loss of permissions and may render you incapable of managing the store. If you experience trouble authenticating, go back and contact your organization's administrator for assistance.",
        id: "hrhqju",
      })}
    </Paragraph>
  );
};
