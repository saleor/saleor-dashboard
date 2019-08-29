import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";

import backgroundArt from "@assets/images/login-background.svg";
import saleorDarkLogo from "@assets/images/logo-dark.svg";
import saleorLightLogo from "@assets/images/logo-light.svg";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import { FormSpacer } from "@saleor/components/FormSpacer";
import useTheme from "@saleor/hooks/useTheme";
import { commonMessages } from "@saleor/intl";

export interface FormData {
  email: string;
  loading: boolean;
  password: string;
  rememberMe: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between"
    },
    link: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      textAlign: "center"
    },
    loginButton: {
      width: 140
    },
    logo: {
      "& svg": {
        display: "block",
        height: 40,
        marginBottom: theme.spacing.unit * 4
      }
    },
    mainPanel: {
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing.unit * 2
      },
      background: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      justifyContent: "center",
      padding: theme.spacing.unit * 6,
      width: "100%"
    },
    mainPanelContent: {
      [theme.breakpoints.up("xs")]: {
        width: "100%"
      },
      [theme.breakpoints.up("sm")]: {
        width: 328
      },
      "@media (min-width: 1440px)": {
        width: 464
      },
      margin: "auto",
      width: "100%"
    },
    panel: {
      "& span": {
        color: theme.palette.error.contrastText
      },
      background: theme.palette.error.main,
      borderRadius: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 3,
      padding: theme.spacing.unit * 1.5
    },
    root: {
      [theme.breakpoints.up("lg")]: {
        gridTemplateColumns: "376px 1fr"
      },
      "@media (min-width: 1440px)": {
        gridTemplateColumns: "520px 1fr"
      },
      display: "grid",
      gridTemplateColumns: "1fr",
      height: "100vh",
      overflow: "hidden",
      width: "100vw"
    },
    sidebar: {
      [theme.breakpoints.up("lg")]: {
        display: "block"
      },
      display: "none"
    },
    sidebarArt: {
      "& svg": {
        width: "100%"
      }
    }
  });

export interface LoginCardProps extends WithStyles<typeof styles> {
  error: boolean;
  disableLoginButton: boolean;
  onPasswordRecovery: () => void;
  onSubmit?(event: FormData);
}

const LoginCard = withStyles(styles, { name: "LoginCard" })(
  ({ classes, error, disableLoginButton, onSubmit }: LoginCardProps) => {
    const { isDark } = useTheme();
    const intl = useIntl();

    return (
      <Form
        initial={{ email: "", password: "", rememberMe: false }}
        onSubmit={onSubmit}
      >
        {({ change: handleChange, data, submit: handleSubmit }) => (
          <div className={classes.root}>
            <div className={classes.sidebar}>
              <SVG className={classes.sidebarArt} src={backgroundArt} />
            </div>
            <div className={classes.mainPanel}>
              <div className={classes.mainPanelContent}>
                <SVG
                  className={classes.logo}
                  src={isDark ? saleorDarkLogo : saleorLightLogo}
                />
                {error && (
                  <div className={classes.panel}>
                    <Typography variant="caption">
                      <FormattedMessage defaultMessage="Sorry, your username and/or password are incorrect. Please try again." />
                    </Typography>
                  </div>
                )}
                <TextField
                  autoFocus
                  fullWidth
                  autoComplete="username"
                  label={intl.formatMessage(commonMessages.email)}
                  name="email"
                  onChange={handleChange}
                  value={data.email}
                  inputProps={{
                    "data-tc": "email"
                  }}
                />
                <FormSpacer />
                <TextField
                  fullWidth
                  autoComplete="current-password"
                  label={intl.formatMessage({
                    defaultMessage: "Password"
                  })}
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={data.password}
                  data-tc="password"
                />
                <FormSpacer />
                <div className={classes.buttonContainer}>
                  <ControlledCheckbox
                    checked={data.rememberMe}
                    label={intl.formatMessage({
                      defaultMessage: "Remember me",
                      description: "login"
                    })}
                    name="rememberMe"
                    onChange={handleChange}
                  />
                  <FormSpacer />
                  <Button
                    className={classes.loginButton}
                    color="primary"
                    disabled={disableLoginButton}
                    variant="contained"
                    onClick={handleSubmit}
                    type="submit"
                    data-tc="submit"
                  >
                    <FormattedMessage
                      defaultMessage="Login"
                      description="button"
                    />
                  </Button>
                </div>
                {/* <FormSpacer />
                <Typography className={classes.link}>
                  {i18n.t("Reset your password")}
                </Typography> */}
              </div>
            </div>
          </div>
        )}
      </Form>
    );
  }
);
LoginCard.displayName = "LoginCard";
export default LoginCard;
