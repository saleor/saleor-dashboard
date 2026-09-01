import { savebarHeight, topBarHeight } from "@dashboard/components/AppLayout/consts";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import Form from "@dashboard/components/Form/Form";
import Grid from "@dashboard/components/Grid/Grid";
import { MediaWithFallback } from "@dashboard/components/MediaWithFallback/MediaWithFallback";
import { Savebar } from "@dashboard/components/Savebar";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { parseOembedData } from "@dashboard/products/utils/parseOembedData";
import { type Ripple } from "@dashboard/ripples/types";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton, Text, vars } from "@saleor/macaw-ui-next";
import { defineMessages, type IntlShape, useIntl } from "react-intl";

import { MediaNavigation } from "./MediaNavigation";

const messages = defineMessages({
  editMedia: {
    id: "Ihp4D3",
    defaultMessage: "Edit Media",
    description: "header",
  },
  editImage: {
    id: "EHRXv4",
    defaultMessage: "Edit Image",
    description: "product media detail page header",
  },
  editVideo: {
    id: "YDIpJq",
    defaultMessage: "Edit Video",
    description: "product media detail page header",
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
  editMediaMetadata: {
    id: "cg1bRE",
    defaultMessage: "Edit media metadata",
    description: "product media detail page, top-bar metadata button tooltip",
  },
  altText: {
    id: "SwtcgX",
    defaultMessage: "Alt text",
    description: "product media alt text field label",
  },
});
// Fits below top nav + savebar, this card's header, and content padding.
const previewStageHeight = `calc(100vh - ${topBarHeight} - ${savebarHeight} - 120px)`;

const useStyles = makeStyles(
  theme => ({
    grid: {
      alignItems: "start",
    },
    mediaViewColumn: {
      alignSelf: "start",
      position: "sticky",
      top: theme.spacing(3),
    },
    previewStage: {
      alignItems: "center",
      border: `1px solid ${vars.colors.border.default1}`,
      borderRadius: theme.spacing(),
      boxSizing: "border-box",
      display: "flex",
      height: previewStageHeight,
      justifyContent: "center",
      maxHeight: previewStageHeight,
      overflow: "visible",
      padding: theme.spacing(2),
      width: "100%",
    },
    previewMedia: {
      display: "block",
      maxHeight: "100%",
      maxWidth: "100%",
      objectFit: "contain",
    },
    previewVideo: {
      alignSelf: "center",
      aspectRatio: "16 / 9",
      flexShrink: 1,
      height: "auto",
      maxHeight: "100%",
      maxWidth: "100%",
      minWidth: 0,
      position: "relative",
      width: "100%",
      // Provider oembed HTML (e.g. YouTube) uses a padding-bottom responsive wrapper.
      "& > div": {
        height: "100%",
        overflow: "hidden",
        paddingBottom: "0 !important",
        position: "relative",
        width: "100%",
      },
      "& iframe": {
        border: 0,
        display: "block",
        height: "100%",
        left: 0,
        maxHeight: "none",
        maxWidth: "none",
        position: "absolute",
        top: 0,
        width: "100%",
      },
    },
    previewSkeleton: {
      height: "100%",
      width: "100%",
    },
  }),
  { name: "MediaDetailPage" },
);

function getEditMediaTitle(mediaType: string | null | undefined, intl: IntlShape) {
  if (mediaType === "VIDEO") {
    return intl.formatMessage(messages.editVideo);
  }

  if (mediaType === "IMAGE") {
    return intl.formatMessage(messages.editImage);
  }

  return intl.formatMessage(messages.editMedia);
}

interface MediaDetailPageProps {
  /** Owner detail page the top nav and cancel button return to. */
  ownerUrl: string;
  ownerIcon: JSX.Element;
  ownerListLabel: string;
  ownerName: string | undefined;
  mediaObj?: {
    id: string;
    alt: string | null;
    url: string;
    type?: string | null;
    oembedData?: string | null;
  } | null;
  media?: Array<{
    id: string;
    url: string;
  }>;
  disabled: boolean;
  metadataRipple?: Ripple;
  saveButtonBarState: ConfirmButtonTransitionState;
  onDelete: () => void;
  onRowClick: (id: string) => () => void;
  onShowMetadata: () => void;
  onSubmit: (data: { alt: string }) => SubmitPromise<unknown[]>;
}

export const MediaDetailPage = (props: MediaDetailPageProps) => {
  const {
    ownerUrl,
    ownerIcon,
    ownerListLabel,
    ownerName,
    disabled,
    mediaObj,
    media,
    metadataRipple,
    saveButtonBarState,
    onDelete,
    onRowClick,
    onShowMetadata,
    onSubmit,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <Form initial={{ alt: mediaObj?.alt ?? "" }} onSubmit={onSubmit} confirmLeave>
      {({ change, data, submit }) => {
        const handleSave = async () => {
          const errors = await submit();

          if (errors.length === 0) {
            navigate(ownerUrl);
          }
        };

        return (
          <>
            <TopNav
              href={ownerUrl}
              hrefIcon={ownerIcon}
              hrefTitle={ownerListLabel}
              title={
                disabled && !ownerName ? (
                  <Skeleton __width="200px" />
                ) : (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Text size={6} color="default2" ellipsis __maxWidth="200px" title={ownerName}>
                      {ownerName}
                    </Text>
                    <Text size={6} color="default2">
                      /
                    </Text>
                    <Text size={6}>{getEditMediaTitle(mediaObj?.type, intl)}</Text>
                  </Box>
                )
              }
            >
              <TopNav.MetadataButton
                onClick={onShowMetadata}
                disabled={!mediaObj}
                data-test-id="show-media-metadata"
                title={intl.formatMessage(messages.editMediaMetadata)}
                ripple={metadataRipple}
              />
            </TopNav>
            <Grid variant="inverted" className={classes.grid}>
              <div>
                <MediaNavigation
                  disabled={disabled}
                  media={media}
                  highlighted={mediaObj?.id}
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
                      name="alt"
                      label={intl.formatMessage(messages.altText)}
                      disabled={disabled}
                      onChange={change}
                      value={data.alt}
                      multiline
                      fullWidth
                    />
                  </DashboardCard.Content>
                </DashboardCard>
              </div>
              <div className={classes.mediaViewColumn}>
                <DashboardCard>
                  <DashboardCard.Header>
                    <DashboardCard.Title>
                      {intl.formatMessage(messages.mediaView)}
                    </DashboardCard.Title>
                  </DashboardCard.Header>
                  <DashboardCard.Content>
                    <div className={classes.previewStage}>
                      {mediaObj ? (
                        mediaObj.type !== "VIDEO" ? (
                          <MediaWithFallback
                            key={mediaObj.url}
                            className={classes.previewMedia}
                            src={mediaObj.url}
                            alt={mediaObj.alt}
                          />
                        ) : (
                          <div
                            className={classes.previewVideo}
                            dangerouslySetInnerHTML={{
                              __html: parseOembedData(mediaObj.oembedData).html ?? "",
                            }}
                          />
                        )
                      ) : (
                        <Skeleton className={classes.previewSkeleton} />
                      )}
                    </div>
                  </DashboardCard.Content>
                </DashboardCard>
              </div>
            </Grid>
            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(ownerUrl)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={handleSave}
                disabled={disabled || !onSubmit}
                type="button"
              />
            </Savebar>
          </>
        );
      }}
    </Form>
  );
};

MediaDetailPage.displayName = "MediaDetailPage";
