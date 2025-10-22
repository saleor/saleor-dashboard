import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { ExtensionMenuItem } from "@dashboard/extensions/getExtensionsItems";
import { Box, Text } from "@saleor/macaw-ui-next";

type ExtensionsButtonSelectorProps = {
  extensions: Array<ExtensionMenuItem>;
  onClick(ext: ExtensionMenuItem): void;
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
        onClick={() => onClick(firstExtension)}
        options={dropdownExtensions.map(ext => ({
          label: ext.label,
          onSelect: () => onClick(ext),
        }))}
      >
        {firstExtension.label}
      </ButtonGroupWithDropdown>
    </Box>
  );
};
