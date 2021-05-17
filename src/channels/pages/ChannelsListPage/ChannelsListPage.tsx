import {
  Button,
  Card,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Alert from "@saleor/components/Alert/Alert";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { sectionNames } from "@saleor/intl";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Channels_channels } from "../../types/Channels";
import { useStyles } from "./styles";

export interface ChannelsListPageProps {
  channelsList: Channels_channels[] | undefined;
  limits: RefreshLimits_shop_limits;
  navigateToChannelCreate: () => void;
  onBack: () => void;
  onRowClick: (id: string) => () => void;
  onRemove: (id: string) => void;
}

const numberOfColumns = 2;

export const ChannelsListPage: React.FC<ChannelsListPageProps> = ({
  channelsList,
  limits,
  navigateToChannelCreate,
  onBack,
  onRemove,
  onRowClick
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const limitReached = isLimitReached(limits, "channels");

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader
        title={intl.formatMessage(sectionNames.channels)}
        limit={
          hasLimits(limits, "channels") && {
            data: limits,
            key: "channels",
            text: "channels used"
          }
        }
      >
        <Button
          disabled={limitReached}
          onClick={navigateToChannelCreate}
          color="primary"
          variant="contained"
          data-test="add-channel"
        >
          <FormattedMessage
            defaultMessage="Create Channel"
            description="button"
          />
        </Button>
      </PageHeader>
      <Alert
        show={limitReached}
        title={intl.formatMessage({
          defaultMessage: "Channel limit reached",
          description: "alert"
        })}
      >
        <FormattedMessage defaultMessage="You have reached your channel limit, you will be no longer able to add channels to your store. If you would like to up your limit, contact your administration staff about raising your limits." />
      </Alert>
      <Card>
        <ResponsiveTable>
          <TableHead>
            <TableRow>
              <TableCellHeader>
                <FormattedMessage
                  defaultMessage="Channel Name"
                  description="channel name"
                />
              </TableCellHeader>
              <TableCell className={classes.colRight}>
                <FormattedMessage
                  defaultMessage="Actions"
                  description="table actions"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              channelsList,
              channel => (
                <TableRow
                  hover={!!channel}
                  key={channel ? channel.id : "skeleton"}
                  className={classes.tableRow}
                  onClick={!!channel ? onRowClick(channel.id) : undefined}
                >
                  <TableCell className={classes.colName}>
                    <span data-test="name">
                      {channel?.name || <Skeleton />}
                    </span>
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    {channelsList?.length > 1 && (
                      <IconButton
                        color="primary"
                        onClick={
                          channel
                            ? stopPropagation(() => onRemove(channel.id))
                            : undefined
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage defaultMessage="No channels found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </ResponsiveTable>
      </Card>
    </Container>
  );
};

ChannelsListPage.displayName = "ChannelsListPage";
export default ChannelsListPage;
