// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import { Savebar } from "@dashboard/components/Savebar";
import Skeleton from "@dashboard/components/Skeleton";
import { ProductMediaType } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { productUrl } from "@dashboard/products/urls";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ProductMediaNavigation from "../ProductMediaNavigation";

const messages = defineMessages({
  editMedia: {
    id: "Ihp4D3",
    defaultMessage: "Edit Media",
    description: "header",
  },
  mediaInformation: {
    id: "9RvXNg",
    defaultMessage: "Media Information",
    description: "section header",
  },
  mediaView: {
    id: "cW1RIo",
    defaultMessage: "Media View",
    description: "section header",
  },
  optional: {
    id: "lzdvwp",
    defaultMessage: "Optional",
    description: "field is optional",
  },
});
const useStyles = makeStyles(
  theme => ({
    image: {
      height: "100%",
      objectFit: "contain",
      width: "100%",
    },
    imageContainer: {
      "& iframe": {
        width: "100%",
        maxHeight: 420,
      },
      border: `1px solid ${vars.colors.border.default1}`,
      borderRadius: theme.spacing(),
      margin: `0 auto ${theme.spacing(2)}px`,
      width: "100%",
      padding: theme.spacing(2),
    },
  }),
  { name: "ProductMediaPage" },
);

interface ProductMediaPageProps {
  productId: string;
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
  onDelete: () => void;
  onRowClick: (id: string) => () => void;
  onSubmit: (data: { description: string }) => void;
}

const ProductMediaPage: React.FC<ProductMediaPageProps> = props => {
  const {
    productId,
    disabled,
    mediaObj,
    media,
    saveButtonBarState,
    onDelete,
    onRowClick,
    onSubmit,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <Form initial={{ description: mediaObj ? mediaObj.alt : "" }} onSubmit={onSubmit} confirmLeave>
      {({ change, data, submit }) => (
        <>
          <TopNav href={productUrl(productId)} title={intl.formatMessage(messages.editMedia)} />
          <Grid variant="inverted">
            <div>
              <ProductMediaNavigation
                disabled={disabled}
                media={media}
                highlighted={media ? mediaObj.id : undefined}
                onRowClick={onRowClick}
              />
              <DashboardCard>
                <DashboardCard.Header>
                  <DashboardCard.Title>
                    {intl.formatMessage(messages.mediaInformation)}
                  </DashboardCard.Title>
                </DashboardCard.Header>
                <DashboardCard.Content>
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
                </DashboardCard.Content>
              </DashboardCard>
            </div>
            <div>
              <DashboardCard>
                <DashboardCard.Header>
                  <DashboardCard.Title>
                    {intl.formatMessage(messages.mediaView)}
                  </DashboardCard.Title>
                </DashboardCard.Header>
                <DashboardCard.Content>
                  {mediaObj ? (
                    mediaObj?.type === ProductMediaType.IMAGE ? (
                      <div className={classes.imageContainer}>
                        <img className={classes.image} src={mediaObj.url} alt={mediaObj.alt} />
                      </div>
                    ) : (
                      <div
                        className={classes.imageContainer}
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(mediaObj?.oembedData)?.html,
                        }}
                      />
                    )
                  ) : (
                    <Skeleton />
                  )}
                </DashboardCard.Content>
              </DashboardCard>
            </div>
          </Grid>
          <Savebar>
            <Savebar.DeleteButton onClick={onDelete} />
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(productUrl(productId))} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={disabled || !onSubmit}
            />
          </Savebar>
        </>
      )}
    </Form>
  );
};

ProductMediaPage.displayName = "ProductMediaPage";
export default ProductMediaPage;
