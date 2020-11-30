import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Channel as ChannelList } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import RequirePermissions from "@saleor/components/RequirePermissions";
import { CollectionChannelListingErrorFragment } from "@saleor/fragments/types/CollectionChannelListingErrorFragment";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import useUser from "@saleor/hooks/useUser";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { RequireOnlyOne } from "@saleor/misc";
import { PermissionEnum } from "@saleor/types/globalTypes";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import classNames from "classnames";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { DateContext } from "../Date/DateContext";
import { useStyles } from "./styles";

export interface ChannelData {
  id: string;
  isPublished: boolean;
  name: string;
  publicationDate: string | null;
  availableForPurchase?: string;
  isAvailableForPurchase?: boolean;
  visibleInListings?: boolean;
}

export interface Message {
  visibleLabel: string;
  hiddenLabel: string;
  visibleSecondLabel?: string;
  hiddenSecondLabel?: string;
  availableDateText?: string;
  availableLabel?: string;
  unavailableLabel?: string;
  availableSecondLabel?: string;
  setAvailabilityDateLabel?: string;
}

type Error =
  | ProductChannelListingErrorFragment
  | CollectionChannelListingErrorFragment;

interface Value {
  availableForPurchase?: string;
  isAvailableForPurchase?: boolean;
  isPublished: boolean;
  publicationDate: string | null;
  visibleInListings?: boolean;
}
interface ChannelsAvailability {
  channels: ChannelData[];
  channelsList: ChannelList[];
  channelsMessages?: { [id: string]: Message };
  errors?: Error[];
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
  errors: Error[];
  messages: Message;
  onChange: (id: string, data: Value) => void;
}

const Channel: React.FC<ChannelProps> = ({
  data,
  disabled,
  errors,
  messages,
  onChange
}) => {
  const {
    availableForPurchase,
    isAvailableForPurchase: isAvailable,
    isPublished,
    publicationDate,
    visibleInListings,
    id,
    name
  } = data;
  const formData = {
    ...(availableForPurchase !== undefined ? { availableForPurchase } : {}),
    ...(isAvailable !== undefined
      ? { isAvailableForPurchase: isAvailable }
      : {}),
    isPublished,
    publicationDate,
    ...(visibleInListings !== undefined ? { visibleInListings } : {})
  };
  const dateNow = React.useContext(DateContext);
  const localizeDate = useDateLocalize();
  const hasAvailableProps =
    isAvailable !== undefined && availableForPurchase !== undefined;

  const [isPublicationDate, setPublicationDate] = useState(
    publicationDate === null ? true : false
  );
  const [isAvailableDate, setAvailableDate] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();
  const classes = useStyles({});

  const todayDate = localizeDate(new Date(dateNow).toISOString(), "YYYY-MM-DD");

  const visibleMessage = (date: string) =>
    intl.formatMessage(
      {
        defaultMessage: "since {date}",
        description: "date"
      },
      {
        date: localizeDate(date, "L")
      }
    );

  const formErrors = getFormErrors(
    ["availableForPurchaseDate", "publicationDate"],
    errors
  );

  return (
    <>
      <div className={classes.channelItem}>
        <div
          data-test="channel-availability-item"
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
          <Typography variant="caption">
            {messages.availableDateText}
          </Typography>
        </div>
        {isOpen && (
          <>
            <RadioSwitchField
              disabled={disabled}
              firstOptionLabel={
                <>
                  <p className={classes.label}>{messages.visibleLabel}</p>
                  {isPublished &&
                    publicationDate &&
                    Date.parse(publicationDate) < dateNow && (
                      <span className={classes.secondLabel}>
                        {messages.visibleSecondLabel ||
                          visibleMessage(publicationDate)}
                      </span>
                    )}
                </>
              }
              name="isPublished"
              secondOptionLabel={
                <>
                  <p className={classes.label}>{messages.hiddenLabel}</p>
                  {publicationDate &&
                    !isPublished &&
                    Date.parse(publicationDate) >= dateNow && (
                      <span className={classes.secondLabel}>
                        {messages.hiddenSecondLabel}
                      </span>
                    )}
                </>
              }
              value={isPublished}
              onChange={() => {
                onChange(id, {
                  ...formData,
                  isPublished: !isPublished,
                  publicationDate:
                    !isPublished && !publicationDate
                      ? todayDate
                      : publicationDate
                });
              }}
            />
            {!isPublished && (
              <>
                <Typography
                  className={classes.setPublicationDate}
                  onClick={() => setPublicationDate(!isPublicationDate)}
                >
                  {intl.formatMessage({
                    defaultMessage: "Set publication date"
                  })}
                </Typography>
                {isPublicationDate && (
                  <TextField
                    error={!!formErrors.publicationDate}
                    disabled={disabled}
                    label={intl.formatMessage({
                      defaultMessage: "Publish on",
                      description: "publish on date"
                    })}
                    name={`channel:publicationDate:${id}`}
                    type="date"
                    fullWidth={true}
                    helperText={
                      formErrors.publicationDate
                        ? getProductErrorMessage(
                            formErrors.publicationDate,
                            intl
                          )
                        : ""
                    }
                    value={publicationDate ? publicationDate : ""}
                    onChange={e =>
                      onChange(id, {
                        ...formData,
                        publicationDate: e.target.value
                      })
                    }
                    className={classes.date}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              </>
            )}
            {hasAvailableProps && (
              <>
                <Hr />
                <RadioSwitchField
                  disabled={disabled}
                  firstOptionLabel={
                    <>
                      <p className={classes.label}>{messages.availableLabel}</p>
                      {isAvailable &&
                        availableForPurchase &&
                        Date.parse(availableForPurchase) < dateNow && (
                          <span className={classes.secondLabel}>
                            {visibleMessage(availableForPurchase)}
                          </span>
                        )}
                    </>
                  }
                  name={`channel:isAvailableForPurchase:${id}`}
                  secondOptionLabel={
                    <>
                      <p className={classes.label}>
                        {messages.unavailableLabel}
                      </p>
                      {availableForPurchase && !isAvailable && (
                        <span className={classes.secondLabel}>
                          {messages.availableSecondLabel}
                        </span>
                      )}
                    </>
                  }
                  value={isAvailable}
                  onChange={e => {
                    const { value } = e.target;
                    return onChange(id, {
                      ...formData,
                      availableForPurchase: !value
                        ? null
                        : availableForPurchase,
                      isAvailableForPurchase: value
                    });
                  }}
                />
                {!isAvailable && (
                  <>
                    <Typography
                      className={classes.setPublicationDate}
                      onClick={() => setAvailableDate(!isAvailableDate)}
                    >
                      {messages.setAvailabilityDateLabel}
                    </Typography>
                    {isAvailableDate && (
                      <TextField
                        error={!!formErrors.availableForPurchaseDate}
                        disabled={disabled}
                        label={intl.formatMessage({
                          defaultMessage: "Set available on",
                          description: "available on date"
                        })}
                        name={`channel:availableForPurchase:${id}`}
                        type="date"
                        fullWidth={true}
                        helperText={
                          formErrors.availableForPurchaseDate
                            ? getProductErrorMessage(
                                formErrors.availableForPurchaseDate,
                                intl
                              )
                            : ""
                        }
                        value={availableForPurchase ? availableForPurchase : ""}
                        onChange={e =>
                          onChange(id, {
                            ...formData,
                            availableForPurchase: e.target.value
                          })
                        }
                        className={classes.date}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
            {visibleInListings !== undefined && (
              <>
                <Hr />
                <ControlledCheckbox
                  className={classes.checkbox}
                  name={`channel:visibleInListings:${id}`}
                  checked={visibleInListings}
                  disabled={disabled}
                  label={
                    <>
                      <p
                        className={classNames(
                          classes.label,
                          classes.listingLabel
                        )}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Show in product listings"
                        })}
                      </p>

                      <span className={classes.secondLabel}>
                        {intl.formatMessage({
                          defaultMessage:
                            "Disabling this checkbox will remove product from search and category pages. It will be available on collection pages."
                        })}
                      </span>
                    </>
                  }
                  onChange={e =>
                    onChange(id, {
                      ...formData,
                      visibleInListings: e.target.value
                    })
                  }
                />
              </>
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
    errors = [],
    selectedChannelsCount,
    allChannelsCount,
    channels,
    channelsMessages,
    openModal,
    onChange
  } = props;
  const intl = useIntl();
  const classes = useStyles({});
  const { user } = useUser();
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
            <RequirePermissions
              userPermissions={user?.userPermissions || []}
              requiredPermissions={[PermissionEnum.MANAGE_CHANNELS]}
            >
              <Button color="primary" onClick={openModal}>
                {intl.formatMessage({
                  defaultMessage: "Manage",
                  description: "section header button"
                })}
              </Button>
            </RequirePermissions>
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
            ? channels.map(data => {
                const channelErrors =
                  errors?.filter(error => error.channels.includes(data.id)) ||
                  [];
                return (
                  <Channel
                    key={data.id}
                    data={data}
                    errors={channelErrors}
                    onChange={onChange}
                    messages={channelsMessages[data.id]}
                  />
                );
              })
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
