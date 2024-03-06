// @ts-strict-ignore
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNotifier from "@dashboard/hooks/useNotifier";
import { Divider, Fade, Modal, Paper } from "@material-ui/core";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import Downshift from "downshift";
import hotkeys from "hotkeys-js";
import React from "react";
import { useIntl } from "react-intl";

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
import useQuickSearch from "./useQuickSearch";

const navigatorHotkey = "ctrl+k, command+k";
const navigatorNotificationStorageKey = "notifiedAboutNavigator";

function getItemOffset(
  actions: QuickSearchAction[],
  cbs: Array<typeof getViews>,
): number {
  return cbs.reduce((acc, cb) => cb(actions).length + acc, 0);
}

const useStyles = makeStyles(
  theme => ({
    modal: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(3),
    },
    paper: {
      overflow: "hidden",
    },
    root: {
      [theme.breakpoints.down("sm")]: {
        height: "auto",
      },
      height: 500,
      maxWidth: 900,
      outline: 0,
      width: "100%",
    },
  }),
  {
    name: "NavigatorSearch",
  },
);

export interface NavigatorSearchProps {
  visible: boolean;
  setVisibility: (state: boolean) => void;
}

const NavigatorSearch: React.FC<NavigatorSearchProps> = ({
  visible,
  setVisibility,
}) => {
  const input = React.useRef(null);
  const [query, mode, change, actions] = useQuickSearch(visible, input);
  const intl = useIntl();
  const notify = useNotifier();
  const [notifiedAboutNavigator, setNotifiedAboutNavigator] = useLocalStorage(
    navigatorNotificationStorageKey,
    false,
  );
  const classes = useStyles({});
  const theme = useTheme();

  React.useEffect(() => {
    hotkeys(navigatorHotkey, event => {
      event.preventDefault();
      setVisibility(!visible);
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
            keyboardShortcut: navigator.platform.toLowerCase().includes("mac")
              ? "⌘+K"
              : "Ctrl+K",
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
    hasViews(actions) ||
    hasActions(actions) ||
    hasCustomers(actions) ||
    hasCatalog(actions);

  return (
    <Modal
      className={classes.modal}
      open={visible}
      onClose={() => setVisibility(false)}
    >
      <Fade appear in={visible} timeout={theme.transitions.duration.short}>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Downshift
              itemToString={(item: QuickSearchAction) =>
                item ? item.label : ""
              }
              onSelect={(item: QuickSearchAction) => {
                const shouldRemainVisible = item?.onClick();
                if (!shouldRemainVisible) {
                  setVisibility(false);
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
              {({ getInputProps, getItemProps, highlightedIndex }) => (
                <div>
                  <NavigatorSearchInput
                    mode={mode}
                    value={query}
                    {...(getInputProps({
                      value: query,
                    }) as React.InputHTMLAttributes<HTMLInputElement>)}
                    ref={input}
                  />
                  {hasAnything && <Divider />}
                  {hasViews(actions) && (
                    <NavigatorSection
                      label={intl.formatMessage({
                        id: "YYkkhx",
                        defaultMessage: "Navigate to",
                        description: "navigator section header",
                      })}
                      getItemProps={getItemProps}
                      highlightedIndex={highlightedIndex}
                      items={getViews(actions)}
                      offset={0}
                    />
                  )}
                  {hasActions(actions) && (
                    <NavigatorSection
                      label={intl.formatMessage({
                        id: "me585h",
                        defaultMessage: "Quick Actions",
                        description: "navigator section header",
                      })}
                      getItemProps={getItemProps}
                      highlightedIndex={highlightedIndex}
                      items={getActions(actions)}
                      offset={getItemOffset(actions, [getViews])}
                    />
                  )}
                  {hasCustomers(actions) && (
                    <NavigatorSection
                      label={intl.formatMessage({
                        id: "4gT3eD",
                        defaultMessage: "Search in Customers",
                        description: "navigator section header",
                      })}
                      getItemProps={getItemProps}
                      highlightedIndex={highlightedIndex}
                      items={getCustomers(actions)}
                      offset={getItemOffset(actions, [getViews, getActions])}
                    />
                  )}
                  {hasCatalog(actions) && (
                    <NavigatorSection
                      label={intl.formatMessage({
                        id: "7Oorx5",
                        defaultMessage: "Search in Catalog",
                        description: "navigator section header",
                      })}
                      getItemProps={getItemProps}
                      highlightedIndex={highlightedIndex}
                      items={getCatalog(actions)}
                      offset={0}
                    />
                  )}
                </div>
              )}
            </Downshift>
          </Paper>
        </div>
      </Fade>
    </Modal>
  );
};

export default NavigatorSearch;
