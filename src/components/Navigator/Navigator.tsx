import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import Downshift from "downshift";
import hotkeys from "hotkeys-js";
import React from "react";
import { useIntl } from "react-intl";
import cmp from "semver-compare";

import { APP_VERSION } from "@saleor/config";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNotifier from "@saleor/hooks/useNotifier";
import {
  getActions,
  getCatalog,
  getCustomers,
  getViews,
  hasActions,
  hasCatalog,
  hasCustomers,
  hasViews
} from "./modes/utils";
import NavigatorInput from "./NavigatorInput";
import NavigatorSection from "./NavigatorSection";
import { QuickSearchAction } from "./types";
import useQuickSearch from "./useQuickSearch";

const navigatorHotkey = "ctrl+k, command+k";
const navigatorNotificationStorageKey = "notifiedAboutNavigator";

function getItemOffset(
  actions: QuickSearchAction[],
  cbs: Array<typeof getViews>
): number {
  return cbs.reduce((acc, cb) => cb(actions).length + acc, 0);
}

const useStyles = makeStyles(
  theme => ({
    modal: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(3)
    },
    paper: {
      overflow: "hidden"
    },
    root: {
      height: 500,
      maxWidth: 600,
      outline: 0,
      width: "100%"
    }
  }),
  {
    name: "Navigator"
  }
);

const Navigator: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const input = React.useRef(null);
  const [query, mode, change, actions] = useQuickSearch(visible, input);
  const intl = useIntl();
  const notify = useNotifier();
  const [notifiedAboutNavigator, setNotifiedAboutNavigator] = useLocalStorage(
    navigatorNotificationStorageKey,
    false
  );
  const classes = useStyles({});
  const theme = useTheme();

  React.useEffect(() => {
    hotkeys(navigatorHotkey, event => {
      event.preventDefault();
      setVisible(!visible);
    });

    if (cmp(APP_VERSION, "2.1.0") !== 1 && !notifiedAboutNavigator) {
      notify({
        autohide: null,
        text: intl.formatMessage(
          {
            defaultMessage:
              "Our new feature to help you with your daily tasks. Run Navigator using {keyboardShortcut} shortcut.",
            description: "navigator notification"
          },
          {
            keyboardShortcut:
              navigator.platform.toLowerCase().indexOf("mac") >= 0
                ? "⌘+K"
                : "Ctrl+K"
          }
        ),
        title: intl.formatMessage({
          defaultMessage: "Navigator is here to help",
          description: "navigator notification title"
        })
      });
      setNotifiedAboutNavigator(true);
    }

    return () => hotkeys.unbind(navigatorHotkey);
  }, []);

  return (
    <Modal
      className={classes.modal}
      open={visible}
      onClose={() => setVisible(false)}
    >
      <Fade appear in={visible} timeout={theme.transitions.duration.short}>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Downshift
              itemToString={(item: QuickSearchAction) =>
                item ? item.label : ""
              }
              onSelect={(item: QuickSearchAction) => {
                const shouldRemainVisible = item.onClick();
                if (!shouldRemainVisible) {
                  setVisible(false);
                }
              }}
              onInputValueChange={value =>
                change({
                  target: {
                    name: "query",
                    value
                  }
                })
              }
              defaultHighlightedIndex={0}
            >
              {({ getInputProps, getItemProps, highlightedIndex }) => (
                <div>
                  <NavigatorInput
                    mode={mode}
                    value={query}
                    {...getInputProps({
                      value: query
                    })}
                    ref={input}
                  />
                  {hasViews(actions) && (
                    <NavigatorSection
                      label={intl.formatMessage({
                        defaultMessage: "Navigate to",
                        description: "navigator section header"
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
                        defaultMessage: "Quick Actions",
                        description: "navigator section header"
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
                        defaultMessage: "Search in Customers",
                        description: "navigator section header"
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
                        defaultMessage: "Search in Catalog",
                        description: "navigator section header"
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

export default Navigator;
