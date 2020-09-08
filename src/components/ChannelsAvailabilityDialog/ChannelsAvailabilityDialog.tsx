import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ChannelData, ChannelShippingData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    dialog: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    label: {
      fontSize: 14
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center"
    },
    scrollArea: {
      overflowY: "scroll"
    },
    text: {
      marginBottom: 5
    }
  }),
  { name: "ChannelsAvailabilityDialog" }
);
const visibleChannelsNum = 10;

type ChannelOption = ChannelData | ChannelShippingData;

export interface ChannelsAvailabilityDialogProps {
  isSelected: (option: ChannelOption) => boolean;
  channels: ChannelOption[];
  confirmButtonState: ConfirmButtonTransitionState;
  contentType?: string;
  disabled: boolean;
  open: boolean;
  onClose: () => void;
  onChange: (option: ChannelOption) => void;
  onConfirm: () => void;
  selected?: number;
  title: string;
  toggleAll?: (items: ChannelData[], selected: number) => void;
}

export const ChannelsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  isSelected,
  channels,
  confirmButtonState,
  contentType = "",
  disabled,
  open,
  onClose,
  onChange,
  onConfirm,
  selected = 0,
  title,
  toggleAll
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [query, onQueryChange] = React.useState("");
  const [pageNum, setPageNum] = React.useState(visibleChannelsNum);
  const hasMore = channels?.length > pageNum;
  // const {}

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      disabled={disabled}
    >
      <div>
        {!!contentType && (
          <Typography className={classes.text} variant="caption">
            <FormattedMessage
              defaultMessage="Select channels you want for {contentType} to be available on"
              values={{ contentType }}
            />
          </Typography>
        )}
        <TextField
          name="query"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          label={intl.formatMessage({
            defaultMessage: "Search through channels"
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Search through channels"
          })}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: disabled && <CircularProgress size={16} />
          }}
        />
        <div className={classes.dialog}>
          <InfiniteScroll
            pageStart={0}
            hasMore={hasMore}
            useWindow={false}
            loader={
              <div className={classes.loadMoreLoaderContainer}>
                <CircularProgress size={16} />
              </div>
            }
            loadMore={() =>
              pageNum < channels.length &&
              setPageNum(num => num + visibleChannelsNum)
            }
            threshold={100}
            key="infinite-scroll"
          >
            {!!toggleAll && (
              <ControlledCheckbox
                checked={selected !== 0}
                name="allchannels"
                label={
                  <Typography className={classes.label}>
                    <FormattedMessage defaultMessage="Available at all channels" />
                  </Typography>
                }
                onChange={() => toggleAll(channels, selected)}
              />
            )}
            {channels.map((option, index) =>
              index < pageNum && option.name.toLowerCase().includes(query) ? (
                <div key={option.id}>
                  <ControlledCheckbox
                    checked={isSelected(option)}
                    name={option.name}
                    label={
                      <Typography className={classes.label}>
                        {option.name}
                      </Typography>
                    }
                    onChange={() => onChange(option)}
                  />
                </div>
              ) : null
            )}
          </InfiniteScroll>
        </div>
      </div>
    </ActionDialog>
  );
};
ChannelsAvailabilityDialog.displayName = "ChannelsAvailabilityDialog";
export default ChannelsAvailabilityDialog;
