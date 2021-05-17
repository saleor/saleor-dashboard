import { Card, CardContent, TextField } from "@material-ui/core";
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
import { makeStyles } from "@saleor/theme";
import { ProductMediaType } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ProductMediaNavigation from "../ProductMediaNavigation";

const messages = defineMessages({
  editMedia: {
    defaultMessage: "Edit Media",
    description: "header"
  },
  mediaInformation: {
    defaultMessage: "Media Information",
    description: "section header"
  },
  mediaView: {
    defaultMessage: "Media View",
    description: "section header"
  },
  optional: {
    defaultMessage: "Optional",
    description: "field is optional"
  }
});

const useStyles = makeStyles(
  theme => ({
    image: {
      height: "100%",
      objectFit: "contain",
      width: "100%"
    },
    imageContainer: {
      "& iframe": {
        width: "100%",
        maxHeight: 420
      },
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      margin: `0 auto ${theme.spacing(2)}px`,
      width: "100%",
      padding: theme.spacing(2)
    }
  }),
  { name: "ProductMediaPage" }
);

interface ProductMediaPageProps {
  mediaObj?: {
    id: string;
    alt: string;
    url: string;
    type: string;
    oembedData?: string;
  };
  media?: Array<{
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

const ProductMediaPage: React.FC<ProductMediaPageProps> = props => {
  const {
    disabled,
    mediaObj,
    media,
    product,
    saveButtonBarState,
    onBack,
    onDelete,
    onRowClick,
    onSubmit
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Form
      initial={{ description: mediaObj ? mediaObj.alt : "" }}
      onSubmit={onSubmit}
      confirmLeave
    >
      {({ change, data, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>{product}</AppHeader>
          <PageHeader title={intl.formatMessage(messages.editMedia)} />
          <Grid variant="inverted">
            <div>
              <ProductMediaNavigation
                disabled={disabled}
                media={media}
                highlighted={media ? mediaObj.id : undefined}
                onRowClick={onRowClick}
              />
              <Card>
                <CardTitle
                  title={intl.formatMessage(messages.mediaInformation)}
                />
                <CardContent>
                  <TextField
                    name="description"
                    label={intl.formatMessage(commonMessages.description)}
                    helperText={intl.formatMessage(messages.optional)}
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
                <CardTitle title={intl.formatMessage(messages.mediaView)} />
                <CardContent>
                  {!!mediaObj ? (
                    mediaObj?.type === ProductMediaType.IMAGE ? (
                      <div className={classes.imageContainer}>
                        <img
                          className={classes.image}
                          src={mediaObj.url}
                          alt={mediaObj.alt}
                        />
                      </div>
                    ) : (
                      <div
                        className={classes.imageContainer}
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(mediaObj?.oembedData)?.html
                        }}
                      />
                    )
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
      )}
    </Form>
  );
};
ProductMediaPage.displayName = "ProductMediaPage";
export default ProductMediaPage;
