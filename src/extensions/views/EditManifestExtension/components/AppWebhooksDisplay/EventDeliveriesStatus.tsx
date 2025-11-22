import { EventDeliveryStatusEnum } from "@dashboard/graphql";
import { Chip, Text, ThemeTokensValues } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

const mapDeliveryStatusToTextColor = (
  status: EventDeliveryStatusEnum,
): keyof ThemeTokensValues["colors"]["text"] => {
  switch (status) {
    case "FAILED":
      return "critical1";
    case "PENDING":
      return "accent1";
    case "SUCCESS":
      return "success1";
  }
};

const mapDeliveryStatusToBorderColor = (
  status: EventDeliveryStatusEnum,
): keyof ThemeTokensValues["colors"]["border"] => {
  switch (status) {
    case "FAILED":
      return "critical1";
    case "PENDING":
      return "accent1";
    case "SUCCESS":
      return "success1";
  }
};

const mapDeliveryStatusToBackgroundColor = (
  status: EventDeliveryStatusEnum,
): keyof ThemeTokensValues["colors"]["background"] => {
  switch (status) {
    case "FAILED":
      return "critical1";
    case "PENDING":
      return "default1";
    case "SUCCESS":
      return "accent1";
  }
};

const DeliveryStatusDisplay = ({ status }: { status: EventDeliveryStatusEnum }) => {
  const { formatMessage } = useIntl();

  switch (status) {
    case "FAILED":
      return <>{formatMessage({ defaultMessage: "Failed", id: "vXCeIi" })}</>;
    case "PENDING":
      return <>{formatMessage({ defaultMessage: "Pending", id: "eKEL/g" })}</>;
    case "SUCCESS":
      return <>{formatMessage({ defaultMessage: "Success", id: "xrKHS6" })} </>;
    default:
      throw new Error("Invalid EventDeliveryStatusEnum value");
  }
};

export const EventDeliveryStatusChip = ({ status }: { status: EventDeliveryStatusEnum }) => {
  return (
    <Chip
      backgroundColor={mapDeliveryStatusToBackgroundColor(status)}
      borderColor={mapDeliveryStatusToBorderColor(status)}
    >
      <Text color={mapDeliveryStatusToTextColor(status)}>
        <DeliveryStatusDisplay status={status} />
      </Text>
    </Chip>
  );
};
