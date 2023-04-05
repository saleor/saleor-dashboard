import { AppLink } from "@dashboard/apps/types";
import Link from "@dashboard/components/Link";
import { Box, Text } from "@saleor/macaw-ui/next";
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
      gap={7}
      borderLeftStyle="solid"
      borderRightStyle="solid"
      borderWidth={1}
      borderColor="neutralPlain"
      paddingY={6}
      paddingX={8}
    >
      {links?.map(link => (
        <Box as="span" key={link.name}>
          <Text variant="body" size="small" color="textBrandDefault">
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
