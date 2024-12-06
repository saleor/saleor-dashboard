// @ts-strict-ignore
import { LanguageCodeEnum, LanguageFragment } from "@dashboard/graphql";
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList as Menu,
  Paper,
  Popper,
} from "@material-ui/core";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useState, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { DashboardCard } from "../Card";

export interface LanguageSwitchProps {
  currentLanguage: LanguageCodeEnum;
  languages: LanguageFragment[];
  getLanguageUrl: (lang: LanguageCodeEnum) => string;
}

const useStyles = makeStyles(
  theme => ({
    arrow: {
      color: theme.palette.primary.main,
      transition: theme.transitions.duration.standard + "ms",
    },
    container: {
      paddingBottom: theme.spacing(1),
    },
    menuContainer: {
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      minWidth: 90,
      padding: theme.spacing(),
      position: "relative",
    },
    menuItem: {
      textAlign: "justify",
    },
    menuPaper: {
      maxHeight: 600,
      overflow: "scroll",
    },
    popover: {
      zIndex: 1,
    },
    rotate: {
      transform: "rotate(180deg)",
    },
  }),
  { name: "LanguageSwitch" },
);
const LanguageSwitch = (props: LanguageSwitchProps) => {
  const { currentLanguage, languages, getLanguageUrl } = props;
  const classes = useStyles(props);
  const [isExpanded, setExpandedState] = useState(false);
  const anchor = useRef();

  return (
    <div className={classes.container} ref={anchor}>
      <DashboardCard
        className={classes.menuContainer}
        onClick={() => setExpandedState(!isExpanded)}
      >
        <Text>{currentLanguage}</Text>
        <ArrowDropDown
          className={clsx(classes.arrow, {
            [classes.rotate]: isExpanded,
          })}
        />
      </DashboardCard>
      <Popper
        className={classes.popover}
        open={isExpanded}
        anchorEl={anchor.current}
        transition
        placement="bottom-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom" ? "right top" : "right bottom",
            }}
          >
            <Paper className={classes.menuPaper} elevation={8}>
              <ClickAwayListener onClickAway={() => setExpandedState(false)} mouseEvent="onClick">
                <Menu>
                  {languages.map(lang => (
                    <MenuItem
                      key={lang.code}
                      className={classes.menuItem}
                      onClick={() => {
                        setExpandedState(false);
                      }}
                    >
                      <Link to={getLanguageUrl(lang.code)}>
                        <FormattedMessage
                          id="62T585"
                          defaultMessage="{languageName} - {languageCode}"
                          description="button"
                          values={{
                            languageCode: lang.code,
                            languageName: lang.language,
                          }}
                        />
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

LanguageSwitch.displayName = "LanguageSwitch";
export default LanguageSwitch;
