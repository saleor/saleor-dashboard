import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { IconButton } from "@saleor/macaw-ui";
import { Box, Popover, PopoverContentProps, sprinkles, Text } from "@saleor/macaw-ui-next";
import { Columns3 } from "lucide-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import useStyles, { cellHeight, singleActionWidth } from "../styles";
import { AvailableColumn } from "../types";
import { ColumnPickerCategories } from "./ColumnPickerCategories";
import { ColumnPickerDynamicColumns } from "./ColumnPickerDynamicColumns";
import { ColumnPickerStaticColumns } from "./ColumnPickerStaticColumns";
import messages from "./messages";
import { ColumnCategory } from "./useColumns";
import { rightColumnBoxShadow } from "./utils";

interface ColumnPickerProps {
  staticColumns: AvailableColumn[];
  dynamicColumns?: AvailableColumn[] | null | undefined;
  selectedColumns: string[];
  columnCategories?: ColumnCategory[];
  onToggle: (columnId: string) => void;
  side?: PopoverContentProps["side"];
  align?: PopoverContentProps["align"];
}

export const ColumnPicker = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  dynamicColumns,
  onToggle,
  side,
  align,
}: ColumnPickerProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles({});

  return (
    <Popover
      modal
      open={pickerOpen}
      onOpenChange={() => {
        setExpanded(false);
        setPickerOpen(isPickerOpen => !isPickerOpen);
      }}
    >
      <Popover.Trigger>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          __width={singleActionWidth - 1}
          __height={cellHeight}
          backgroundColor="default1"
          borderLeftStyle="solid"
          borderLeftWidth={1}
          borderColor="default1"
          __boxShadow={rightColumnBoxShadow}
        >
          <IconButton
            data-test-id="open-column-picker-button"
            variant="ghost"
            className={classes.ghostIcon}
            title="Pick columns"
          >
            <Columns3 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          </IconButton>
        </Box>
      </Popover.Trigger>
      <Popover.Content
        className={sprinkles({ margin: 1.5, zIndex: "1" })}
        align={align}
        side={side}
      >
        <Box display="grid" gridTemplateColumns={expanded ? 2 : 1} overflow="hidden">
          {expanded && columnCategories && (
            <ColumnPickerCategories
              columnCategories={columnCategories}
              selectedColumns={selectedColumns}
              onToggle={onToggle}
              onClose={() => setExpanded(false)}
            />
          )}
          <Box
            __width="320px"
            __maxHeight="50vh"
            __minHeight={expanded ? "502px" : undefined}
            backgroundColor="default1"
            padding={4}
            overflow="scroll"
          >
            <Box marginBottom={3}>
              <Text size={1} color="default2">
                <FormattedMessage {...messages.column} />
              </Text>
            </Box>
            <ColumnPickerStaticColumns
              staticColumns={staticColumns}
              handleToggle={onToggle}
              selectedColumns={selectedColumns}
            />
            {columnCategories && (
              <ColumnPickerDynamicColumns
                dynamicColumns={dynamicColumns}
                setExpanded={setExpanded}
                onToggle={onToggle}
              />
            )}
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
