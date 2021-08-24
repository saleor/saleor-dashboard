import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { useProductTagListQuery } from "./queries";
import { useProductTagCreateMutation, useProductTagDeleteMutation } from "./mutations";

interface Props {
  productId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  button: {
    width: "100%",
  },
  gridLabel: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const ProductTags: React.FC<Props> = ({ productId }) => {
  const classes = useStyles({});

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [tag, setTag] = useState<string>("");

  const { data, loading, refetch } = useProductTagListQuery({
    displayLoader: true,
    variables: {
      first: 20,
      product: productId,
    }
  });

  const [
    createProductTag,
    createProductTagOptions,
  ] = useProductTagCreateMutation({});

  const [
    deleteProductTag,
    deleteProductTagOptions,
  ] = useProductTagDeleteMutation({});

  const pending = loading && !data;

  const saving = !!createProductTagOptions?.loading || !!deleteProductTagOptions?.loading;

  const handleTagChange = (ev) => {
    setTag(ev.target.value);
  };

  const handleCreate = async () => {
    if (tag) {
      const { data: { productTagCreate } } = await createProductTag({
        variables: {
          product: productId,
          name: tag,
        },
      });

      if (!productTagCreate?.errors.length) {
        refetch();

        setTag("");
      }
    }
  };

  const handleSelectedClose = () => setSelectedTag(null);

  const handleDelete = async () => {
    const { data: { productTagDelete } } = await deleteProductTag({ variables: { id: selectedTag } });

    if (!productTagDelete?.errors.length) {
      refetch();

      handleSelectedClose();;
    }
  };

  return (
    <Fragment>
      <Card>
        <CardTitle title="Search Tags" />

        {pending ? (
          <CardContent>
            <Skeleton />
          </CardContent>
        ) : (
          <CardContent>
            <Paper className={classes.root}>
              {data?.productTags?.edges.map(({ node }) => (
                <Chip
                  key={node.id}
                  label={node.tag.name}
                  onDelete={() => setSelectedTag(node.id)}
                  className={classes.chip}
                />
              ))}
            </Paper>

            <Grid container spacing={3} alignItems="center">
              <Grid
                item
                xs={3}
                className={classes.gridLabel}
              >
                <Typography variant="body1">Add Search Tag:</Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="search-tag"
                  label="Enter keyword here"
                  fullWidth
                  onChange={handleTagChange}
                  value={tag}
                  disabled={saving}
                />
              </Grid>

              <Grid item xs={3}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  className={classes.button}
                  onClick={handleCreate}
                  disabled={saving}
                >
                  {saving ? <CircularProgress /> : "Add"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      <Dialog
        open={!!selectedTag}
        onClose={handleSelectedClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSelectedClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ProductTags;
