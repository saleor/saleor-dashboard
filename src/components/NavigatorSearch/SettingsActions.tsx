import Link from "@dashboard/components/Link";
import { useSettingsCatalogSearch } from "@dashboard/configuration/settingsCatalog/catalog";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type MouseEvent } from "react";
import { FormattedMessage } from "react-intl";

interface SettingsActionsProps {
  query: string;
  onActionClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const CMDK_SETTINGS_RESULT_LIMIT = 8;

/**
 * Cmd+K settings results from the shared settings catalog (not useActionTriggers).
 */
export const SettingsActions = ({
  query,
  onActionClick,
}: SettingsActionsProps): JSX.Element | null => {
  const results = useSettingsCatalogSearch(query);
  const hasQuery = query.trim().length > 0;

  if (!hasQuery || results.length === 0) {
    return null;
  }

  const visibleResults = results.slice(0, CMDK_SETTINGS_RESULT_LIMIT);

  return (
    <Box paddingY={1} data-test-id="navigator-settings-actions">
      <Text fontWeight="medium" size={2} color="default2" paddingX={6}>
        <FormattedMessage
          id="00ll1/"
          defaultMessage="Settings"
          description="Cmd+K section heading for settings catalog results"
        />
      </Text>
      {visibleResults.map(entry => (
        <Box key={entry.id} onClick={onActionClick}>
          <Link
            href={entry.href}
            data-href={entry.href}
            id={`navigator-settings-${entry.id}`}
            className="command-menu-item"
          >
            <Box
              className="command-menu-item-content"
              display="flex"
              flexDirection="column"
              gap={0.5}
              color="default1"
              paddingX={6}
              paddingY={1.5}
              role="option"
              tabIndex={-1}
            >
              {entry.breadcrumbPath ? (
                <Text size={1} color="default2">
                  {entry.breadcrumbPath}
                </Text>
              ) : null}
              <Text size={2} fontWeight="medium" color="default1">
                {entry.title}
              </Text>
            </Box>
          </Link>
        </Box>
      ))}
    </Box>
  );
};
