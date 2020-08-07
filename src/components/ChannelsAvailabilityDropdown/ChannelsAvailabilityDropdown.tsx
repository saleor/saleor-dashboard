import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Hr from "@saleor/components/Hr";
import StatusLabel from "@saleor/components/StatusLabel";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { ProductList_products_edges_node_channelListing } from "@saleor/products/types/ProductList";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface ChannelsAvailabilityDropdownProps {
  allChannelsCount: number;
  channels: ProductList_products_edges_node_channelListing[];
  currentChannel: ProductList_products_edges_node_channelListing;
}

export const ChannelsAvailabilityDropdown: React.FC<ChannelsAvailabilityDropdownProps> = ({
  allChannelsCount,
  channels,
  currentChannel
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const localizeData = useDateLocalize();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => setAnchorEl(event.currentTarget);

  const handleClose = () => {
    setAnchorEl(null);
  };

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
              defaultMessage: "Available in {count}",
              description: "product status title"
            },
            {
              count: channels.length
            }
          )}
          status={currentChannel.isPublished ? "success" : "error"}
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
              description: "product channel"
            },
            {
              date: localizeData(channelData.publicationDate, "DD/MM/YYYY")
            }
          );

          const publishedText = intl.formatMessage(
            {
              defaultMessage: "published since {date}",
              description: "product channel"
            },
            {
              date: localizeData(channelData.publicationDate, "DD/MM/YYYY")
            }
          );

          return (
            <MenuItem key={channelData.channel.id} className={classes.menuItem}>
              <StatusLabel
                label={channelData.channel.name}
                status={channelData.isPublished ? "success" : "error"}
              />
              <div>
                <Typography variant="caption" className={classes.caption}>
                  {channelData.isPublished
                    ? publishedText
                    : channelData.publicationDate && !channelData.isPublished
                    ? notPublishedText
                    : intl.formatMessage({ defaultMessage: "hidden" })}
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
