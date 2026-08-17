import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type TimelineDateGroupKey } from "./groupEventsByDate";

interface TimelineDateGroupHeaderProps {
  groupKey: TimelineDateGroupKey | string;
  /** When this is the only bucket on the timeline, spell out “Older than 30 days”. */
  isSoleGroup?: boolean;
}

export const TimelineDateGroupHeader = ({
  groupKey,
  isSoleGroup = false,
}: TimelineDateGroupHeaderProps): JSX.Element => {
  const intl = useIntl();

  const getLabel = (key: string): string => {
    switch (key) {
      case "TODAY":
        return intl.formatMessage({
          id: "zWgbGg",
          defaultMessage: "Today",
        });
      case "YESTERDAY":
        return intl.formatMessage({
          id: "IradBW",
          defaultMessage: "Yesterday",
          description: "date group header",
        });
      case "LAST_7_DAYS":
        return intl.formatMessage({
          id: "0/Y0nG",
          defaultMessage: "Last 7 days",
          description: "date group header",
        });
      case "LAST_30_DAYS":
        return intl.formatMessage({
          id: "4kcpaI",
          defaultMessage: "Last 30 days",
          description: "date group header",
        });
      case "OLDER":
        return isSoleGroup
          ? intl.formatMessage({
              id: "8RDDZP",
              defaultMessage: "Older than 30 days",
              description: "date group header when it is the only group on the timeline",
            })
          : intl.formatMessage({
              id: "LU8dtl",
              defaultMessage: "Older",
              description: "date group header",
            });
      default:
        return intl.formatMessage({
          id: "yn7Stx",
          defaultMessage: "Unknown",
          description: "date group header",
        });
    }
  };

  return (
    <Box paddingY={3}>
      <Text
        size={2}
        fontWeight="medium"
        color="default2"
        style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        {getLabel(groupKey)}
      </Text>
    </Box>
  );
};
