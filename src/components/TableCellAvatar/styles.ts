import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    root: {
      "&:not(first-child)": {
        paddingLeft: 0,
      },
      paddingRight: theme.spacing(3),
      width: "1%",
    },
  }),
  { name: "TableCellAvatar" },
);

export const useAvatarStyles = makeStyles(
  theme => ({
    alignRight: {
      justifyContent: "flex-end",
    },
    children: {
      alignSelf: "center",
      marginLeft: theme.spacing(2),
      width: "100%",
    },
    content: {
      alignItems: "center",
      display: "flex",
    },
    root: {
      "&:not(first-child)": {
        paddingLeft: 0,
      },
      paddingRight: theme.spacing(3),
      width: "1%",
    },
  }),
  { name: "Avatar" },
);

export const useAvatarImageStyles = makeStyles(
  theme => ({
    avatar: {
      background: "none",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      color: theme.palette.grey[500],
      display: "inline-flex",
      padding: theme.spacing(0.5),
    },
  }),
  { name: "AvatarImage" },
);
