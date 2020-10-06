import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Channel as ChannelList, ChannelData } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import classNames from "classnames";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { DateContext } from "../Date/DateContext";
import { useStyles } from "./styles";

export interface ChannelsAvailabilityProps {
  channels: ChannelData[];
  channelsList: ChannelList[];
  selectedChannelsCount: number;
  allChannelsCount: number;
  disabled?: boolean;
  onChange?: (id: string, data: Value) => void;
  openModal: () => void;
}
export type ChannelsAvailabilityProps = RequireOnlyOne<
  ChannelsAvailability,
  "channels" | "channelsList"
>;

interface ChannelProps {
  disabled?: boolean;
  data: ChannelData;
  onChange: (id: string, data: Value) => void;
}

const Channel: React.FC<ChannelProps> = ({ data, disabled, onChange }) => {
  const { isPublished, publicationDate, id, name } = data;
  const dateNow = React.useContext(DateContext);
  const localizeDate = useDateLocalize();

  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();
  const classes = useStyles({});

  const todayDate = localizeDate(new Date(dateNow).toString(), "YYYY-MM-DD");
  const availableDateText =
    publicationDate && !isPublished
      ? intl.formatMessage(
          {
            defaultMessage: "Will become available on {date}",
            description: "channel publication date"
          },
          {
            date: localizeDate(publicationDate, "L")
          }
        )
      : publicationDate
      ? intl.formatMessage(
          {
            defaultMessage: "Visible since {date}",
            description: "channel publication date"
          },
          {
            date: localizeDate(publicationDate, "L")
          }
        )
      : intl.formatMessage({
          defaultMessage: "Hidden",
          description: "channel publication status"
        });

  return (
    <>
      <div className={classes.channelItem}>
        <div
          role="button"
          className={classes.channelBtn}
          onClick={() => setOpen(open => !open)}
        >
          <div className={classes.channelName}>
            <Typography>{name}</Typography>
            <ArrowDropdown
              className={classNames(classes.arrow, {
                [classes.rotate]: isOpen
              })}
              color="primary"
            />
          </div>
          <Typography variant="caption">{availableDateText}</Typography>
        </div>
        {isOpen && (
          <>
            <RadioSwitchField
              disabled={disabled}
              firstOptionLabel={
                <p className={classes.label}>
                  {intl.formatMessage({
                    defaultMessage: "Visible",
                    description: "channel publication status"
                  })}
                </p>
              }
              name={`channel:${id}`}
              secondOptionLabel={
                <p className={classes.label}>
                  {intl.formatMessage({
                    defaultMessage: "Hidden",
                    description: "channel publication status"
                  })}
                </p>
              }
              value={isPublished}
              onChange={() => {
                onChange(id, {
                  isPublished: !isPublished,
                  publicationDate:
                    !isPublished && !publicationDate
                      ? todayDate
                      : publicationDate
                });
              }}
            />

            {!isPublished && (
              <TextField
                disabled={disabled}
                label={intl.formatMessage({
                  defaultMessage: "Publish on",
                  description: "publish on date"
                })}
                name={`channel:publicationDate:${id}`}
                type="date"
                fullWidth={true}
                value={publicationDate || ""}
                className={classes.date}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e =>
                  onChange(id, {
                    isPublished,
                    publicationDate: e.target.value
                  })
                }
              />
            )}
          </>
        )}
      </div>
      <Hr className={classes.hr} />
    </>
  );
};

export const ChannelsAvailability: React.FC<ChannelsAvailabilityProps> = props => {
  const {
    channelsList,
    selectedChannelsCount,
    allChannelsCount,
    channels,
    openModal,
    onChange
  } = props;
  const intl = useIntl();
  const classes = useStyles({});
  const channelsAvailabilityText = intl.formatMessage(
    {
      defaultMessage:
        "Available at {selectedChannelsCount} out of {allChannelsCount, plural, one {# channel} other {# channels}}",

      description: "channels availability text"
    },
    {
      allChannelsCount,
      selectedChannelsCount
    }
  );
  return (
    <>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Availability",
            description: "section header"
          })}
          toolbar={
            <Button color="primary" onClick={openModal}>
              {intl.formatMessage({
                defaultMessage: "Manage",
                description: "section header button"
              })}
            </Button>
          }
        />
        <CardContent className={classes.card}>
          {!!channelsAvailabilityText && (
            <>
              <Typography className={classes.channelInfo}>
                {channelsAvailabilityText}
              </Typography>
              <Hr className={classes.hr} />
            </>
          )}
          {channels
            ? channels.map(data => (
                <Channel key={data.id} data={data} onChange={onChange} />
              ))
            : channelsList
            ? channelsList.map(data => (
                <React.Fragment key={data.id}>
                  <div className={classes.channelItem}>
                    <div className={classes.channelName}>
                      <Typography>{data.name}</Typography>
                    </div>
                  </div>
                  <Hr className={classes.hr} />
                </React.Fragment>
              ))
            : null}
        </CardContent>
      </Card>
    </>
  );
};
ChannelsAvailability.displayName = "ChannelsAvailability";
export default ChannelsAvailability;
