import { GridTable } from "@dashboard/components/GridTable";
import { Box, Text } from "@saleor/macaw-ui-next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { refundGridMessages } from "./messages";

interface ShowAllLinesBarProps {
  expanded: boolean;
  totalCount: number;
  onToggle: () => void;
}

const TOTAL_COLUMNS = 6;

export const ShowAllLinesBar = ({ expanded, totalCount, onToggle }: ShowAllLinesBarProps) => {
  return (
    <GridTable.Row>
      <GridTable.Cell colSpan={TOTAL_COLUMNS} padding={0} backgroundColor="default2">
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
          backgroundColor={{ default: "default2", hover: "default1Hovered" }}
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
