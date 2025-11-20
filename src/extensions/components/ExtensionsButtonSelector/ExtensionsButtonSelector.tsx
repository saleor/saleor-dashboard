import { ExtensionMenuItem } from "@dashboard/extensions/getExtensionsItems";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  ChervonDownIcon,
  Dropdown,
  List,
  Text,
} from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

type ExtensionsButtonSelectorProps = {
  extensions: Array<ExtensionMenuItem>;
  onClick(ext: ExtensionMenuItem): void;
};

interface ButtonGroupWithDropdownProps extends BoxProps {
  onClick?: () => void;
  options: Array<{
    label: string | ReactNode;
    testId?: string;
    onSelect: <T extends object>(params: T) => void;
  }>;
  testId?: string;
  disabled?: boolean;
  variant?: ButtonProps["variant"];
}

// TODO: consider moving this to Macaw UI
// TODO: This is a clone of ButtonGroupWithDropdown component but adjusted for secondary style - for apps. We can unify them (probably in Macaw)
const ButtonGroupWithDropdown = ({
  children,
  options,
  onClick,
  disabled = false,
  testId,
  variant,
  ...boxProps
}: ButtonGroupWithDropdownProps) => {
  const shouldRenderDropdown = options.length > 0;

  if (!shouldRenderDropdown) {
    return (
      <Box {...boxProps}>
        <Button
          __height="50px"
          variant={variant}
          onClick={onClick}
          data-test-id={testId}
          __minWidth="80px"
          disabled={disabled}
          // TODO: fix this in Macaw UI - allow overriding border radius
          boxShadow="none"
          display="flex"
          justifyContent="start"
        >
          <Box
            justifySelf="start"
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Text lineHeight={2} color="default2" __fontSize="10px">
              Apps
            </Text>
            {children}
          </Box>
        </Button>
      </Box>
    );
  }

  return (
    <Dropdown>
      <Box display="flex" {...boxProps}>
        <Button
          __height="50px"
          variant={variant}
          onClick={onClick}
          data-test-id={testId}
          __minWidth="80px"
          disabled={disabled}
          // TODO: fix this in Macaw UI - allow overriding border radius
          __borderRightWidth={0}
          __borderBottomRightRadius={0}
          __borderTopRightRadius={0}
          boxShadow="none"
          display="flex"
          justifyContent="start"
        >
          <Box
            justifySelf="start"
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Text lineHeight={2} color="default2" __fontSize="10px">
              Apps
            </Text>
            {children}
          </Box>
        </Button>

        <Dropdown.Trigger>
          <Button
            __height="50px"
            variant={variant}
            icon={<ChervonDownIcon />}
            disabled={disabled}
            borderColor="default1"
            borderLeftWidth={1}
            borderLeftStyle="solid"
            __borderBottomLeftRadius={0}
            __borderTopLeftRadius={0}
            boxShadow="none"
            __width="40px"
          />
        </Dropdown.Trigger>
      </Box>

      <Dropdown.Content align="end">
        <Box>
          <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
            {options.map((item, idx) => (
              <Dropdown.Item key={`button-group-dropdown-item-${idx}`}>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  onClick={item.onSelect}
                  data-test-id={item.testId}
                >
                  <Text>{item.label}</Text>
                </List.Item>
              </Dropdown.Item>
            ))}
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};

// todo implement "pin" functionality to keep selected extension on first position
// todo use it instead of "cog"
export const ExtensionsButtonSelector = ({
  extensions,
  onClick,
}: ExtensionsButtonSelectorProps) => {
  const [firstExtension, ...dropdownExtensions] = extensions;

  return (
    <Box>
      <ButtonGroupWithDropdown
        variant="secondary"
        onClick={() => onClick(firstExtension)}
        options={dropdownExtensions.map(ext => ({
          label: (
            <Box display="flex" gap={2} alignItems="center">
              {ext.avatar && <img width={"15px"} height="15px" src={ext.avatar} />}
              {ext.label}
            </Box>
          ),
          onSelect: () => onClick(ext),
        }))}
      >
        <Box display="flex" gap={2} alignItems="center">
          {firstExtension.avatar && (
            <img width={"15px"} height="15px" src={firstExtension.avatar} />
          )}

          <Text size={3} lineHeight={2}>
            {firstExtension.label}
          </Text>
        </Box>
      </ButtonGroupWithDropdown>
    </Box>
  );
};
