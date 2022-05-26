import {
  Card,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList as Menu,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import { LanguageCodeEnum, LanguageFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

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

const LanguageSwitch: React.FC<LanguageSwitchProps> = props => {
  const { currentLanguage, languages, getLanguageUrl } = props;
  const classes = useStyles(props);

  const [isExpanded, setExpandedState] = React.useState(false);
  const anchor = React.useRef();

  return (
    <div className={classes.container} ref={anchor}>
      <Card
        className={classes.menuContainer}
        onClick={() => setExpandedState(!isExpanded)}
      >
        <Typography>{currentLanguage}</Typography>
        <ArrowDropDown
          className={classNames(classes.arrow, {
            [classes.rotate]: isExpanded,
          })}
        />
      </Card>
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
              transformOrigin:
                placement === "bottom" ? "right top" : "right bottom",
            }}
          >
            <Paper className={classes.menuPaper} elevation={8}>
              <ClickAwayListener
                onClickAway={() => setExpandedState(false)}
                mouseEvent="onClick"
              >
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
