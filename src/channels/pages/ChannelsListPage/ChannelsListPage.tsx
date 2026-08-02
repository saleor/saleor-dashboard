import { channelCreateSetupFlow } from "@dashboard/channels/ripples/channelCreateSetupFlow";
import { channelUrl } from "@dashboard/channels/urls";
import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableRowLink from "@dashboard/components/TableRowLink";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { type ChannelDetailsFragment, type RefreshLimitsQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface ChannelsListPageProps {
  channelsList: ChannelDetailsFragment[] | undefined;
  limits: RefreshLimitsQuery["shop"]["limits"];
  onAddChannel: () => void;
  onRemove: (id: string) => void;
}

const numberOfColumns = 5;

const ChannelsListPage = ({
  channelsList,
  limits,
  onAddChannel,
  onRemove,
}: ChannelsListPageProps) => {
  const intl = useIntl();
  const classes = useStyles({});
  const limitReached = isLimitReached(limits, "channels");

  return (
    <ListPageLayout>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.channels)}>
        <Box position="relative">
          <Button
            disabled={limitReached}
            variant="primary"
            data-test-id="add-channel"
            onClick={onAddChannel}
          >
            <FormattedMessage id="OGm8wO" defaultMessage="Create Channel" description="button" />
          </Button>
          <Box position="absolute" __top="-4px" __right="-4px">
            <Ripple model={channelCreateSetupFlow} />
          </Box>
        </Box>
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
      <DashboardCard marginTop={6}>
        <DashboardCard.Content>
          <ResponsiveTable>
            <TableHead>
              <TableRowLink>
                <TableCellHeader>
                  <FormattedMessage id="hh0xW7" defaultMessage="Channel Name" />
                </TableCellHeader>
                <TableCellHeader>
                  <FormattedMessage
                    id="YX7eDk"
                    defaultMessage="Currency"
                    description="channel list column"
                  />
                </TableCellHeader>
                <TableCellHeader>
                  <FormattedMessage
                    id="wzfVrA"
                    defaultMessage="Country"
                    description="channel list column"
                  />
                </TableCellHeader>
                <TableCellHeader>
                  <FormattedMessage
                    id="N2RGVh"
                    defaultMessage="Status"
                    description="channel list column"
                  />
                </TableCellHeader>
                <TableCell />
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
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <span data-test-id="name">{channel?.name || <Skeleton />}</span>
                        {channel && channel.warehouses.length === 0 && (
                          <Text size={1} color="warning1">
                            <FormattedMessage
                              id="qmV/np"
                              defaultMessage="No warehouse"
                              description="channel readiness hint"
                            />
                          </Text>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {channel ? <Text size={2}>{channel.currencyCode}</Text> : <Skeleton />}
                    </TableCell>
                    <TableCell>
                      {channel ? (
                        <Text size={2}>{channel.defaultCountry.country}</Text>
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell>
                      {channel ? (
                        <Text size={2} color={channel.isActive ? "success1" : "default2"}>
                          {channel.isActive ? (
                            <FormattedMessage
                              id="HBrAXs"
                              defaultMessage="Active"
                              description="channel status"
                            />
                          ) : (
                            <FormattedMessage
                              id="rZh6/D"
                              defaultMessage="Inactive"
                              description="channel status"
                            />
                          )}
                        </Text>
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colAction}>
                      {channelsList && channelsList.length > 1 && (
                        <TableButtonWrapper>
                          <Button
                            variant="secondary"
                            data-test-id="delete-channel"
                            icon={
                              <Trash2
                                size={iconSize.small}
                                strokeWidth={iconStrokeWidthBySize.small}
                              />
                            }
                            onClick={
                              channel ? stopPropagation(() => onRemove(channel.id)) : undefined
                            }
                            marginLeft="auto"
                            marginRight={1}
                          />
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
        </DashboardCard.Content>
      </DashboardCard>
    </ListPageLayout>
  );
};

ChannelsListPage.displayName = "ChannelsListPage";
export default ChannelsListPage;
