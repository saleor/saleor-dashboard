import { GridTable } from "@dashboard/components/GridTable";
import { Box, Text } from "@saleor/macaw-ui-next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { REFUND_TABLE_COLUMN_COUNT } from "./consts";
import { refundGridMessages } from "./messages";

interface ShowAllLinesBarProps {
  expanded: boolean;
  totalCount: number;
  onToggle: () => void;
}

export const ShowAllLinesBar = ({ expanded, totalCount, onToggle }: ShowAllLinesBarProps) => {
  return (
    <GridTable.Row>
      <GridTable.Cell colSpan={REFUND_TABLE_COLUMN_COUNT} padding={0} backgroundColor="default1">
        <Box
          as="button"
          type="button"
          onClick={onToggle}
          data-test-id="refund-show-all-lines"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          width="100%"
          paddingY={2}
          cursor="pointer"
          backgroundColor={{ default: "default1", hover: "default1Hovered" }}
          borderWidth={0}
        >
          <Text size={2} color="default2" fontWeight="medium">
            {expanded ? (
              <FormattedMessage {...refundGridMessages.showLessLines} />
            ) : (
              <FormattedMessage
                {...refundGridMessages.showAllLines}
                values={{ count: totalCount }}
              />
            )}
          </Text>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Box>
      </GridTable.Cell>
    </GridTable.Row>
  );
};
