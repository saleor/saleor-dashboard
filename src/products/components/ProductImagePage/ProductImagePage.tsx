import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardTitle from "@saleor/components/CardTitle";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import Skeleton from "@saleor/components/Skeleton";
import { commonMessages } from "@saleor/intl";
import ProductImageNavigation from "../ProductImageNavigation";

const styles = (theme: Theme) =>
  createStyles({
    image: {
      height: "100%",
      objectFit: "contain",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing.unit,
      margin: `0 auto ${theme.spacing.unit * 2}px`,
      maxWidth: 552,
      padding: theme.spacing.unit * 2
    }
  });

interface ProductImagePageProps extends WithStyles<typeof styles> {
  image?: {
    id: string;
    alt: string;
    url: string;
  };
  images?: Array<{
    id: string;
    url: string;
  }>;
  disabled: boolean;
  product: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onDelete: () => void;
  onRowClick: (id: string) => () => void;
  onSubmit: (data: { description: string }) => void;
}

const ProductImagePage = withStyles(styles, { name: "ProductImagePage" })(
  ({
    classes,
    disabled,
    image,
    images,
    product,
    saveButtonBarState,
    onBack,
    onDelete,
    onRowClick,
    onSubmit
  }: ProductImagePageProps) => {
    const intl = useIntl();

    return (
      <Form
        initial={{ description: image ? image.alt : "" }}
        onSubmit={onSubmit}
        confirmLeave
      >
        {({ change, data, hasChanged, submit }) => {
          return (
            <Container>
              <AppHeader onBack={onBack}>{product}</AppHeader>
              <PageHeader
                title={intl.formatMessage({
                  defaultMessage: "Edit Photo",
                  description: "header"
                })}
              />
              <Grid variant="inverted">
                <div>
                  <ProductImageNavigation
                    disabled={disabled}
                    images={images}
                    highlighted={image ? image.id : undefined}
                    onRowClick={onRowClick}
                  />
                  <Card>
                    <CardTitle
                      title={intl.formatMessage({
                        defaultMessage: "Photo Information",
                        description: "section header"
                      })}
                    />
                    <CardContent>
                      <TextField
                        name="description"
                        label={intl.formatMessage(commonMessages.description)}
                        helperText={intl.formatMessage({
                          defaultMessage: "Optional",
                          description: "field is optional"
                        })}
                        disabled={disabled}
                        onChange={change}
                        value={data.description}
                        multiline
                        fullWidth
                      />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardTitle
                      title={intl.formatMessage({
                        defaultMessage: "Photo View",
                        description: "section header"
                      })}
                    />
                    <CardContent>
                      {!!image ? (
                        <div className={classes.imageContainer}>
                          <img src={image.url} className={classes.image} />
                        </div>
                      ) : (
                        <Skeleton />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Grid>
              <SaveButtonBar
                disabled={disabled || !onSubmit || !hasChanged}
                state={saveButtonBarState}
                onCancel={onBack}
                onDelete={onDelete}
                onSave={submit}
              />
            </Container>
          );
        }}
      </Form>
    );
  }
);
ProductImagePage.displayName = "ProductImagePage";
export default ProductImagePage;
