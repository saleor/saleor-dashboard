import { useAppNavigation } from "@dashboard/extensions/hooks/useAppNavigation";
import { appMessages } from "@dashboard/extensions/messages";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { isAppGlobalId } from "@dashboard/extensions/utils/isAppGlobalId";
import { Box, Spinner, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Redirect, useLocation } from "react-router";

type ResolutionState =
  | { status: "resolving" }
  | { status: "resolved"; id: string }
  | { status: "notInstalled" }
  | { status: "failed" };

const Centered = ({ children }: { children: ReactNode }): JSX.Element => (
  <Box display="flex" justifyContent="center" alignItems="center" padding={12}>
    {children}
  </Box>
);

/**
 * Swaps the `:id` segment of `/extensions/app/:id/...` for the resolved app ID,
 * keeping the deep path, query string and hash intact.
 */
const buildAppIdUrl = (
  { pathname, search, hash }: { pathname: string; search: string; hash: string },
  appId: string,
): string => {
  const deepPath = pathname.split("/").slice(4);

  return (
    [ExtensionsPaths.resolveViewManifestExtension(encodeURIComponent(appId)), ...deepPath].join(
      "/",
    ) +
    search +
    hash
  );
};

const RedirectFromIdentifier = ({ identifier }: { identifier: string }): JSX.Element => {
  const location = useLocation();
  const { resolveAppIdFromIdentifier } = useAppNavigation();
  const [state, setState] = useState<ResolutionState>({ status: "resolving" });

  useEffect(
    function resolveIdentifierToAppId() {
      let cancelled = false;

      resolveAppIdFromIdentifier(identifier)
        .then(id => {
          if (!cancelled) {
            setState(id ? { status: "resolved", id } : { status: "notInstalled" });
          }
        })
        // A failed lookup is not proof the app is missing - don't send the user to Explore.
        .catch(() => {
          if (!cancelled) {
            setState({ status: "failed" });
          }
        });

      return () => {
        cancelled = true;
      };
    },
    [identifier, resolveAppIdFromIdentifier],
  );

  if (state.status === "failed") {
    return (
      <Centered>
        <Text size={3} color="default2">
          <FormattedMessage {...appMessages.failedToResolveAppIdentifier} />
        </Text>
      </Centered>
    );
  }

  if (state.status === "notInstalled") {
    return <Redirect to={ExtensionsPaths.exploreExtensions} />;
  }

  if (state.status === "resolved") {
    return <Redirect to={buildAppIdUrl(location, state.id)} />;
  }

  return (
    <Centered>
      <Spinner />
    </Centered>
  );
};

interface ResolveAppIdProps {
  segment: string;
  children: (id: string) => ReactNode;
}

/**
 * `/extensions/app/<segment>` accepts both the app ID and the manifest
 * identifier (`saleor.app.adyen`), so links stay valid across environments -
 * the ID is unique per installation, the identifier is not.
 *
 * An identifier is resolved once and replaced with the ID form, so everything
 * rendered below this component only ever sees an app ID.
 */
export const ResolveAppId = ({ segment, children }: ResolveAppIdProps): JSX.Element => {
  if (isAppGlobalId(segment)) {
    return <>{children(segment)}</>;
  }

  return <RedirectFromIdentifier identifier={segment} />;
};
