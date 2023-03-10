import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      padding: `0 13px`,
      fontSize: theme.spacing(1.5),
      position: "fixed",
      zIndex: 100,
      width: "240px",
      bottom: theme.spacing(2),
      backgroundColor: `#111111`,
      color: `rgba(255,255,255,.8)`,
      borderRadius: `9px`,
      boxShadow: `0 2px 8px 1px rgba(0,0,0,.3)`,
      right: theme.spacing(2),
      transition: "right 0.3s cubic-bezier(.4,0,.2,1)",
    },
    hidden: {
      right: "-220px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    close: {
      cursor: "pointer",
    },
    link: {
      "&:hover": {
        backgroundColor: `rgba(255,255,255,.1)`,
      },
      "&:active": {
        backgroundColor: `rgba(255,255,255,.2)`,
      },
      backgroundColor: `rgba(255,255,255,.08)`,
      borderRadius: `4px`,
      display: "flex",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      fontWeight: 700,
      color: `white`,
      boxShadow: `0 1px 1px 1px rgba(0,0,0, 100%), 0 1px 0px rgba(255,255,255,.1) inset`,
    },
    icon: {
      width: `20px`,
      height: `20px`,
      marginRight: theme.spacing(1),
    },
  }),
  {
    name: "DemoBanner",
  },
);

export default useStyles;
