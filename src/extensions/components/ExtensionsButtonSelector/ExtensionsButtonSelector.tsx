import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { Box, Text } from "@saleor/macaw-ui-next";

type ExtensionsButtonSelectorProps = {
  extensions: Array<{
    id: string;
    name: string;
  }>;
  onClick(id: string): void;
};

// todo implement "pin" functionality to keep selected extension on first position
export const ExtensionsButtonSelector = ({
  extensions,
  onClick,
}: ExtensionsButtonSelectorProps) => {
  const [firstExtension, ...dropdownExtensions] = extensions;

  return (
    <Box>
      <Text size={1} color="default2">
        Apps
      </Text>
      <ButtonGroupWithDropdown
        variant="secondary"
        onClick={() => onClick(firstExtension.id)}
        options={dropdownExtensions.map(ext => ({
          label: ext.name,
          onSelect: () => onClick(ext.id),
        }))}
      >
        {firstExtension.name}
      </ButtonGroupWithDropdown>
    </Box>
  );
};
