// @ts-strict-ignore
import { channelAddUrl, channelUrl } from "@dashboard/channels/urls";
import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableRowLink from "@dashboard/components/TableRowLink";
import { configurationMenuUrl } from "@dashboard/configuration";
import { ChannelDetailsFragment, RefreshLimitsQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Card, TableBody, TableCell, TableHead } from "@material-ui/core";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface ChannelsListPageProps {
  channelsList: ChannelDetailsFragment[] | undefined;
  limits: RefreshLimitsQuery["shop"]["limits"];
  onRemove: (id: string) => void;
}

const numberOfColumns = 2;

export const ChannelsListPage: React.FC<ChannelsListPageProps> = ({
  channelsList,
  limits,
  onRemove,
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const limitReached = isLimitReached(limits, "channels");

  return (
    <ListPageLayout>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.channels)}>
        <Button
          disabled={limitReached}
          href={channelAddUrl}
          variant="primary"
          data-test-id="add-channel"
        >
          <FormattedMessage id="OGm8wO" defaultMessage="Create Channel" description="button" />
        </Button>
        {hasLimits(limits, "channels") && (
          <LimitsInfo
            text={intl.formatMessage(
              {
                id: "rZMT44",
                defaultMessage: "{count}/{max} channels used",
                description: "created channels counter",
              },
              {
                count: limits.currentUsage.channels,
                max: limits.allowedUsage.channels,
              },
            )}
          />
        )}
      </TopNav>
      {limitReached && (
        <LimitReachedAlert
          title={intl.formatMessage({
            id: "PTW56s",
            defaultMessage: "Channel limit reached",
            description: "alert",
          })}
        >
          <FormattedMessage
            id="ZMy18J"
            defaultMessage="You have reached your channel limit, you will be no longer able to add channels to your store. If you would like to up your limit, contact your administration staff about raising your limits."
          />
        </LimitReachedAlert>
      )}
      <Card>
        <ResponsiveTable>
          <TableHead>
            <TableRowLink>
              <TableCellHeader>
                <FormattedMessage
                  id="j/vV0n"
                  defaultMessage="Channel Name"
                  description="channel name"
                />
              </TableCellHeader>
              <TableCell className={classes.colRight}>
                <FormattedMessage
                  id="VHuzgq"
                  defaultMessage="Actions"
                  description="table actions"
                />
              </TableCell>
            </TableRowLink>
          </TableHead>
          <TableBody data-test-id="channel-list">
            {renderCollection(
              channelsList,
              channel => (
                <TableRowLink
                  data-test-id="channel-row"
                  hover={!!channel}
                  key={channel ? channel.id : "skeleton"}
                  className={classes.tableRow}
                  href={channel && channelUrl(channel.id)}
                >
                  <TableCell className={classes.colName}>
                    <span data-test-id="name">{channel?.name || <Skeleton />}</span>
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    {channelsList?.length > 1 && (
                      <TableButtonWrapper>
                        <IconButton
                          variant="secondary"
                          color="primary"
                          data-test-id="delete-channel"
                          onClick={
                            channel ? stopPropagation(() => onRemove(channel.id)) : undefined
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableButtonWrapper>
                    )}
                  </TableCell>
                </TableRowLink>
              ),
              () => (
                <TableRowLink>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage id="/glQgs" defaultMessage="No channels found" />
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      </Card>
    </ListPageLayout>
  );
};

ChannelsListPage.displayName = "ChannelsListPage";
export default ChannelsListPage;
