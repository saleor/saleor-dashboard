import { makeStyles } from "@saleor/macaw-ui";

export interface HorizontalSpacerProps {
  spacing?: number;
}

const useStyles = makeStyles(
  theme => ({
    container: ({ spacing }: Required<HorizontalSpacerProps>) => ({
      width: theme.spacing(spacing),
    }),
  }),
  { name: "HorizontalSpacer" },
);
const HorizontalSpacer = ({ spacing = 1 }: HorizontalSpacerProps) => {
  const classes = useStyles({ spacing });

  return <div className={classes.container} />;
};

export default HorizontalSpacer;
