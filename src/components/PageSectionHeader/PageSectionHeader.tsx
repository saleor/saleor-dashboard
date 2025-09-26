import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { Box, Text } from "@saleor/macaw-ui-next";

interface PageSectionHeaderProps {
  title?: string;
  description?: string;
}

const PageSectionHeader = (props: PageSectionHeaderProps) => {
  const { title, description } = props;

  return (
    <Box paddingTop={6}>
      {title && (
        <Text size={3} fontWeight="bold" lineHeight={2}>
          {title}
        </Text>
      )}
      {title && description && <VerticalSpacer />}
      {description && (
        <Text size={3} fontWeight="regular">
          {description}
        </Text>
      )}
    </Box>
  );
};

PageSectionHeader.displayName = "PageSectionHeader";
export default PageSectionHeader;
