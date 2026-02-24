import { type Container } from "@dashboard/types";
import { Box, Checkbox, RadioGroup, Text } from "@saleor/macaw-ui-next";

interface SingleSelectionRowsProps {
  containers: Container[];
  selectedItemId: string;
  onSelect: (id: string) => void;
}

export const SingleSelectionRows = ({
  containers,
  selectedItemId,
  onSelect,
}: SingleSelectionRowsProps) => (
  <>
    {containers?.map(container => {
      const isSelected = selectedItemId === container.id;

      return (
        <Box
          key={container.id}
          display="flex"
          alignItems="center"
          gap={3}
          cursor="pointer"
          paddingX={3}
          paddingY={2}
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderColor="default1"
          data-test-id="dialog-row"
          data-selected={isSelected}
          onClick={() => onSelect(container.id)}
        >
          <RadioGroup.Item value={container.id} id={container.id} name="container-selection">
            {null}
          </RadioGroup.Item>
          <Box flexGrow="1" data-test-id={container.name}>
            <Text size={3}>{container.name}</Text>
          </Box>
        </Box>
      );
    })}
  </>
);

interface MultiSelectionRowsProps {
  containers: Container[];
  isSelected: (id: string) => boolean;
  onToggle: (item: Container) => void;
}

export const MultiSelectionRows = ({
  containers,
  isSelected,
  onToggle,
}: MultiSelectionRowsProps) => (
  <>
    {containers?.map(container => (
      <Box
        key={container.id}
        display="flex"
        alignItems="center"
        gap={3}
        cursor="pointer"
        paddingX={3}
        paddingY={2}
        borderBottomWidth={1}
        borderBottomStyle="solid"
        borderColor="default1"
        data-test-id="dialog-row"
        onClick={() => onToggle(container)}
      >
        <Box __transform="scale(1.2)">
          <Checkbox checked={isSelected(container.id)} />
        </Box>
        <Box flexGrow="1" data-test-id={container.name}>
          <Text size={3}>{container.name}</Text>
        </Box>
      </Box>
    ))}
  </>
);
