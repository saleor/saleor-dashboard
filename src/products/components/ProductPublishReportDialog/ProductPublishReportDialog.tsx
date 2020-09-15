import {createStyles, Dialog, DialogTitle, Grid, Link, makeStyles, Paper, Theme} from "@material-ui/core";
import {renderCollection} from "@saleor/misc";
import React from "react";


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
  isPublished: boolean;
  onClose?();
}

const ProductPublishReportDialog: React.FC<ProductPublishReportDialogProps> = props => {
  const { open, onClose, privateMetadataMap, isPublished } = props;
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
              <Link href={"https://allegro.pl/oferta/aukcja-" + privateMetadataMap['publish.allegro.id'] +
              ((!isPublished && privateMetadataMap['publish.allegro.status'] === 'moderated') ? '/restore' : '')} target="_blank">
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
            err => (
                <p>{err}</p>
              ),
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
