import photoIcon from "@assets/images/photo-icon.svg";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import {
  StaffErrorFragment,
  StaffMemberDetailsFragment,
} from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getStaffErrorMessage from "@saleor/utils/errors/staff";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";

import { getUserInitials } from "../../../misc";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      "& svg": {
        fill: "#fff",
      },
      "&:hover $avatarHover": {
        opacity: 1,
      },
      alignItems: "center",
      borderRadius: "100%",
      display: "grid",
      height: 120,
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      width: 120,
    },
    avatarActionText: {
      "&:hover": {
        textDecoration: "underline",
      },
      color: "#fff",
      cursor: "pointer",
      fontSize: 12,
    },
    avatarDefault: {
      "& div": {
        color: "#fff",
        fontSize: 35,
        fontWeight: "bold",
        lineHeight: "120px",
      },
      background: theme.palette.primary.main,
      height: 120,
      textAlign: "center",
      width: 120,
    },
    avatarHover: {
      background: "#00000080",
      borderRadius: "100%",
      fontSize: 12,
      fontWeight: 500,
      height: 120,
      opacity: 0,
      padding: theme.spacing(2.5, 0),
      position: "absolute",
      textAlign: "center",
      textTransform: "uppercase",
      transition: "opacity 0.5s",
      width: 120,
    },
    avatarImage: {
      pointerEvents: "none",
      width: "100%",
    },
    fileField: {
      display: "none",
    },
    prop: {
      marginBottom: theme.spacing(2),
    },
    propGrid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(1),
      gridTemplateColumns: "1fr 1fr",
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "1fr",
      },
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(4),
      gridTemplateColumns: "120px 1fr",
    },
  }),
  { name: "StaffProperties" },
);

interface StaffPropertiesProps {
  canEditAvatar: boolean;
  className?: string;
  data: {
    email: string;
    firstName: string;
    lastName: string;
  };
  errors: StaffErrorFragment[];
  disabled: boolean;
  staffMember: StaffMemberDetailsFragment;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
}

const StaffProperties: React.FC<StaffPropertiesProps> = props => {
  const {
    canEditAvatar,
    className,
    data,
    errors,
    staffMember,
    onChange,
    onImageDelete,
    onImageUpload,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const imgInputAnchor = React.createRef<HTMLInputElement>();

  const clickImgInput = () => imgInputAnchor.current.click();
  const formErrors = getFormErrors(
    ["id", "firstName", "lastName", "email"],
    errors || [],
  );

  const hasAvatar = !!staffMember?.avatar?.url;

  const getFieldProps = (name: string) => ({
    disabled: props.disabled,
    error: !!formErrors[name],
    helperText: formErrors[name]?.message,
    label: intl.formatMessage(commonMessages[name]),
    name,
    value: data[name],
  });

  return (
    <Card className={className}>
      <CardTitle
        title={intl.formatMessage({
          id: "VTITVe",
          defaultMessage: "Staff Member Information",
          description: "section header",
        })}
      />
      <CardContent>
        <div className={classes.root}>
          <div>
            <div className={classes.avatar}>
              {hasAvatar ? (
                <img
                  className={classes.avatarImage}
                  src={staffMember.avatar.url}
                />
              ) : (
                <div className={classes.avatarDefault}>
                  <Typography>{getUserInitials(data)}</Typography>
                </div>
              )}
              {canEditAvatar && (
                <div className={classes.avatarHover}>
                  <SVG src={photoIcon} />
                  <Typography
                    onClick={clickImgInput}
                    className={classes.avatarActionText}
                  >
                    <FormattedMessage
                      id="+2VzH4"
                      defaultMessage="Change"
                      description="avatar change button"
                    />
                  </Typography>
                  {hasAvatar && (
                    <>
                      <Typography
                        onClick={onImageDelete}
                        className={classes.avatarActionText}
                      >
                        <FormattedMessage
                          id="11lR5V"
                          defaultMessage="Delete"
                          description="avatar delete button"
                        />
                      </Typography>
                    </>
                  )}
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
                  {...getFieldProps("firstName")}
                  onChange={onChange}
                  fullWidth
                />
              </div>
              <div className={classes.prop}>
                <TextField
                  {...getFieldProps("lastName")}
                  onChange={onChange}
                  fullWidth
                />
              </div>
              <div className={classes.prop}>
                <TextField
                  {...getFieldProps("email")}
                  onChange={onChange}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {!!formErrors.id && (
        <CardContent>
          <Typography color="error">
            {getStaffErrorMessage(formErrors.id, intl)}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};
StaffProperties.displayName = "StaffProperties";
export default StaffProperties;
