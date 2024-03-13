import { AppLink } from "@dashboard/apps/types";
import Link from "@dashboard/components/Link";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface AppListCardLinksProps {
  links: AppLink[];
}

const AppListCardLinks: React.FC<AppListCardLinksProps> = ({ links }) => {
  if (!links.length) {
    return null;
  }

  return (
    <Box
      as="div"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap={4}
      borderLeftStyle="solid"
      borderRightStyle="solid"
      borderWidth={1}
      borderColor="default1"
      paddingY={3}
      paddingX={5}
    >
      {links?.map(link => (
        <Box as="span" key={link.name}>
          <Text typeSize={3} color="accent1">
            <Link href={link.url} target="_blank">
              {link.name}
            </Link>
          </Text>
        </Box>
      ))}
    </Box>
  );
};

AppListCardLinks.displayName = "AppListCardLinks";
export default AppListCardLinks;
