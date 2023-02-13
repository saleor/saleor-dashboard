import Link from "@dashboard/components/Link";
import { AppLink } from "@dashboard/new-apps/types";
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
    <Box as="ul" display="flex" flexDirection="row" gap={7}>
      {links.map(link => (
        <Box as="li" key={link.name}>
          {/** TODO: change to textBrandDefault */}
          <Text variant="body" size="small" color="iconBrandDefault">
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
