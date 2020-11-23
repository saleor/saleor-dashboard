import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { CollectionList_collections_edges_node_channelListings } from "@saleor/collections/types/CollectionList";
import Hr from "@saleor/components/Hr";
import StatusLabel from "@saleor/components/StatusLabel";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

type Channels = Pick<
  CollectionList_collections_edges_node_channelListings,
  "isPublished" | "publicationDate" | "channel"
>;

export interface ChannelsAvailabilityDropdownProps {
  allChannelsCount: number;
  channels: Channels[];
  currentChannel: Channels;
}

const isActive = (channelData: Channels) => channelData?.isPublished;

export const ChannelsAvailabilityDropdown: React.FC<ChannelsAvailabilityDropdownProps> = ({
  allChannelsCount,
  channels,
  currentChannel
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const localizeDate = useDateLocalize();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);
  return (
    <div onClick={e => e.stopPropagation()}>
      <div
        aria-controls="availability-menu"
        aria-haspopup="true"
        role="button"
        onClick={handleClick}
      >
        <StatusLabel
          label={intl.formatMessage(
            {
              defaultMessage: "Available in {count}/{allCount}",
              description: "product status title"
            },
            {
              allCount: allChannelsCount,
              count: channels.length
            }
          )}
          status={isActive(currentChannel) ? "success" : "error"}
        />
      </div>
      <Menu
        id="availability-menu"
        anchorEl={anchorEl}
        keepMounted
        elevation={3}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom"
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top"
        }}
      >
        <Typography className={classes.title}>
          <FormattedMessage
            defaultMessage="Available in {count} out of {allCount, plural, one {# channel} other {# channels}}"
            description="product status"
            values={{
              allCount: allChannelsCount,
              count: channels.length
            }}
          />
        </Typography>
        <Hr className={classes.hr} />
        {channels.map(channelData => {
          const notPublishedText = intl.formatMessage(
            {
              defaultMessage: "Will become available on {date}",
              description: "product channel publication date"
            },
            {
              date: localizeDate(channelData.publicationDate, "L")
            }
          );

          const publishedText = intl.formatMessage(
            {
              defaultMessage: "published since {date}",
              description: "product channel  publication date"
            },
            {
              date: localizeDate(channelData.publicationDate, "L")
            }
          );

          return (
            <MenuItem key={channelData.channel.id} className={classes.menuItem}>
              <StatusLabel
                label={channelData.channel.name}
                status={isActive(channelData) ? "success" : "error"}
              />
              <div>
                <Typography variant="caption" className={classes.caption}>
                  {channelData.isPublished && channelData.publicationDate
                    ? publishedText
                    : channelData.publicationDate && !channelData.isPublished
                    ? notPublishedText
                    : channelData.isPublished
                    ? ""
                    : intl.formatMessage({
                        defaultMessage: "hidden",
                        description: "product channel publication status"
                      })}
                </Typography>
              </div>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
ChannelsAvailabilityDropdown.displayName = "ChannelsAvailabilityDropdown";
export default ChannelsAvailabilityDropdown;
