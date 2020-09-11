import React from "react";
import {Link, Dialog, DialogTitle, Grid, Paper, makeStyles, createStyles, Theme, Typography} from "@material-ui/core";
import {renderCollection} from "@saleor/misc";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 600,
      padding: theme.spacing(2),
      width: 600
    }
  }),
  { name: "ProductPublishReportDialog" }
);

export interface ProductPublishReportDialogProps {
  open: boolean;
  privateMetadataMap: any;
  onClose?();
}

const ProductPublishReportDialog: React.FC<ProductPublishReportDialogProps> = props => {
  const { open, onClose, privateMetadataMap } = props;
  const classes = useStyles(props);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Raport publikacji</DialogTitle>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <strong>Status allegro</strong>
            <br />
            {privateMetadataMap && privateMetadataMap['publish.allegro.status'] ? privateMetadataMap['publish.allegro.status'] : '-'}
          </Grid>
          <Grid item xs={4}>
            <strong>Data publikacji</strong>
            <br />
            {privateMetadataMap && privateMetadataMap['publish.allegro.date'] ? privateMetadataMap['publish.allegro.date'] : '-'}
          </Grid>
          <Grid item xs={4}>
            {privateMetadataMap && privateMetadataMap['publish.allegro.id'] !== undefined ?
              <Link href={"https://allegro.pl/oferta/aukcja-" + privateMetadataMap['publish.allegro.id']} target="_blank">
                Przejdź do aukcji
              </Link>
              : undefined}
          </Grid>
        </Grid>
        <p>
          <strong>Lista błędów</strong>
          <br />
          {privateMetadataMap && renderCollection(
            privateMetadataMap['publish.allegro.errors'],
            err => {
              return (
                <p>{err}</p>
              );
            },
            () => (
              <p>-</p>
            )
          )}
        </p>
      </Paper>
    </Dialog>
  );
};
ProductPublishReportDialog.displayName = "ProductPublishReportDialog";
export default ProductPublishReportDialog;
