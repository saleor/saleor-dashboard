import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
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

import photoIcon from "@assets/images/photo-icon.svg";
import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { getUserInitials, maybe } from "../../../misc";
import { StaffMemberDetails_user } from "../../types/StaffMemberDetails";

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      "& svg": {
        fill: "#fff"
      },
      "&:hover $avatarHover": {
        opacity: 1
      },
      alignItems: "center",
      borderRadius: "100%",
      display: "grid",
      height: 120,
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      width: 120
    },
    avatarDefault: {
      "& p": {
        color: "#fff",
        fontSize: 35,
        fontWeight: "bold",
        lineHeight: "120px"
      },
      background: theme.palette.primary.main,
      height: 120,
      textAlign: "center",
      width: 120
    },
    avatarHover: {
      "& p": {
        "&:hover": {
          textDecoration: "underline"
        },
        color: theme.palette.primary.main,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 500
      },
      background: "#00000080",
      borderRadius: "100%",
      height: 120,
      opacity: 0,
      padding: `${theme.spacing.unit * 2.5}px 0`,
      position: "absolute",
      textAlign: "center",
      textTransform: "uppercase",
      transition: "opacity 0.5s",
      width: 120
    },
    avatarImage: {
      pointerEvents: "none",
      width: "100%"
    },
    fileField: {
      display: "none"
    },
    prop: {
      marginBottom: theme.spacing.unit * 2 + "px"
    },
    propGrid: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridRowGap: theme.spacing.unit + "px",
      gridTemplateColumns: "1fr 1fr",
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "1fr"
      }
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 4 + "px",
      gridTemplateColumns: "120px 1fr"
    }
  });

interface StaffPropertiesProps extends WithStyles<typeof styles> {
  canEditAvatar: boolean;
  className?: string;
  data: {
    email: string;
    firstName: string;
    lastName: string;
  };
  disabled: boolean;
  staffMember: StaffMemberDetails_user;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
}

const StaffProperties = withStyles(styles, { name: "StaffProperties" })(
  ({
    canEditAvatar,
    classes,
    className,
    data,
    staffMember,
    onChange,
    onImageDelete,
    onImageUpload
  }: StaffPropertiesProps) => {
    const intl = useIntl();
    const imgInputAnchor = React.createRef<HTMLInputElement>();

    const clickImgInput = () => imgInputAnchor.current.click();

    return (
      <Card className={className}>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Staff Member Information",
            description: "section header"
          })}
        />
        <CardContent>
          <div className={classes.root}>
            <div>
              <div className={classes.avatar}>
                {maybe(() => staffMember.avatar.url) ? (
                  <img
                    className={classes.avatarImage}
                    src={maybe(() => staffMember.avatar.url)}
                  />
                ) : (
                  <div className={classes.avatarDefault}>
                    <Typography>{getUserInitials(data)}</Typography>
                  </div>
                )}
                {canEditAvatar && (
                  <div className={classes.avatarHover}>
                    <SVG src={photoIcon} />
                    <Typography onClick={clickImgInput}>
                      <FormattedMessage
                        defaultMessage="Change photo"
                        description="button"
                      />
                    </Typography>
                    <Typography onClick={onImageDelete}>
                      <FormattedMessage
                        defaultMessage="Delete photo"
                        description="button"
                      />
                    </Typography>
                    <input
                      className={classes.fileField}
                      id="fileUpload"
                      onChange={event => onImageUpload(event.target.files[0])}
                      type="file"
                      ref={imgInputAnchor}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className={classes.propGrid}>
                <div className={classes.prop}>
                  <TextField
                    label={intl.formatMessage(commonMessages.firstName)}
                    value={data.firstName}
                    name="firstName"
                    onChange={onChange}
                    fullWidth
                  />
                </div>
                <div className={classes.prop}>
                  <TextField
                    label={intl.formatMessage(commonMessages.lastName)}
                    value={data.lastName}
                    name="lastName"
                    onChange={onChange}
                    fullWidth
                  />
                </div>
                <div className={classes.prop}>
                  <TextField
                    label={intl.formatMessage(commonMessages.email)}
                    value={data.email}
                    name="email"
                    onChange={onChange}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
StaffProperties.displayName = "StaffProperties";
export default StaffProperties;
