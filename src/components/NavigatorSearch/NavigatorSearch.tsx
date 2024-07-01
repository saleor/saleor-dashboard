// @ts-strict-ignore
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNotifier from "@dashboard/hooks/useNotifier";
import { Box, Divider } from "@saleor/macaw-ui-next";
import Downshift, { GetItemPropsOptions } from "downshift";
import hotkeys from "hotkeys-js";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { DashboardModal } from "../Modal";
import {
  getActions,
  getCatalog,
  getCustomers,
  getViews,
  hasActions,
  hasCatalog,
  hasCustomers,
  hasViews,
} from "./modes/utils";
import NavigatorSearchInput from "./NavigatorSearchInput";
import NavigatorSection from "./NavigatorSearchSection";
import { QuickSearchAction } from "./types";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";
import useQuickSearch from "./useQuickSearch";

const navigatorHotkey = "ctrl+k, command+k";
const navigatorNotificationStorageKey = "notifiedAboutNavigator";

const Sections = ({
  actions,
  intl,
  getItemProps,
  highlightedIndex,
}: {
  actions: QuickSearchAction[];
  intl: IntlShape;
  getItemProps: (options: GetItemPropsOptions<QuickSearchAction>) => any;
  highlightedIndex: number;
}) => {
  const sectionsToRender = [
    {
      label: intl.formatMessage({
        id: "YYkkhx",
        defaultMessage: "Navigate to",
        description: "navigator section header",
      }),
      check: hasViews,
      fn: getViews,
    },
    {
      label: intl.formatMessage({
        id: "me585h",
        defaultMessage: "Quick Actions",
        description: "navigator section header",
      }),
      check: hasActions,
      fn: getActions,
    },
    {
      label: intl.formatMessage({
        id: "4gT3eD",
        defaultMessage: "Search in Customers",
        description: "navigator section header",
      }),
      check: hasCustomers,
      fn: getCustomers,
    },
    {
      label: intl.formatMessage({
        id: "7Oorx5",
        defaultMessage: "Search in Catalog",
        description: "navigator section header",
      }),
      check: hasCatalog,
      fn: getCatalog,
    },
  ].filter(({ check }) => check(actions));

  return (
    <>
      {sectionsToRender.map(({ label, fn }, index) => (
        <NavigatorSection
          label={label}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          items={fn(actions)}
          offset={index}
          key={index}
        />
      ))}
    </>
  );
};

const NavigatorSearch: React.FC = () => {
  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorSearchContext();
  const input = React.useRef<HTMLInputElement>(null);
  const [query, mode, change, actions] = useQuickSearch(isNavigatorVisible, input);
  const intl = useIntl();
  const notify = useNotifier();
  const [notifiedAboutNavigator, setNotifiedAboutNavigator] = useLocalStorage(
    navigatorNotificationStorageKey,
    false,
  );

  React.useEffect(() => {
    hotkeys(navigatorHotkey, event => {
      event.preventDefault();
      setNavigatorVisibility(!isNavigatorVisible);
    });

    if (!notifiedAboutNavigator) {
      notify({
        text: intl.formatMessage(
          {
            id: "EM+30g",
            defaultMessage:
              "Our new feature to help you with your daily tasks. Run Navigator using {keyboardShortcut} shortcut.",
            description: "navigator notification",
          },
          {
            keyboardShortcut: navigator.platform.toLowerCase().includes("mac") ? "⌘+K" : "Ctrl+K",
          },
        ),
        title: intl.formatMessage({
          id: "Gxm7Qx",
          defaultMessage: "Navigator is here to help",
          description: "navigator notification title",
        }),
      });
      setNotifiedAboutNavigator(true);
    }

    return () => hotkeys.unbind(navigatorHotkey);
  }, []);

  const hasAnything =
    hasViews(actions) || hasActions(actions) || hasCustomers(actions) || hasCatalog(actions);

  return (
    <DashboardModal open={isNavigatorVisible} onChange={setNavigatorVisibility}>
      <DashboardModal.Content backgroundColor="default1" padding={0}>
        <Box __height="500px" __width="640px">
          <Downshift
            itemToString={(item: QuickSearchAction) => (item ? item.label : "")}
            onSelect={(item: QuickSearchAction) => {
              const shouldRemainVisible = item?.onClick();

              if (!shouldRemainVisible) {
                setNavigatorVisibility(false);
              }
            }}
            onInputValueChange={value =>
              change({
                target: {
                  name: "query",
                  value,
                },
              })
            }
            defaultHighlightedIndex={0}
          >
            {({ getInputProps, getItemProps, highlightedIndex, getRootProps }) => (
              <Box
                {...getRootProps()}
                display="flex"
                flexDirection="column"
                flexGrow={1}
                flexShrink={1}
                overflow="hidden"
                __maxHeight="100%"
              >
                <Box padding={4} paddingBottom={0}>
                  <NavigatorSearchInput
                    mode={mode}
                    value={query}
                    {...getInputProps({
                      value: query,
                    })}
                    ref={input}
                  />
                </Box>

                {hasAnything && <Divider marginBottom={0} />}

                <Box padding={4} height="100%" overflowY="auto">
                  <Sections
                    actions={actions}
                    intl={intl}
                    getItemProps={getItemProps}
                    highlightedIndex={highlightedIndex}
                  />
                </Box>
              </Box>
            )}
          </Downshift>
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default NavigatorSearch;
