import {
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import {
  Backlink,
  Button,
  DeleteIcon,
  IconButton,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  makeStyles,
  PageTab,
  PageTabs
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { channelsListUrl } from "@saleor/taxes/urls";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface TaxChannelsPageProps {
  data: any;
  channels: any;
  selectedChannelId: string;
  handleTabChange: (tab: string) => void;
  onBack: () => void;
}

const useStyles = makeStyles(
  theme => ({
    clickable: {
      cursor: "pointer"
    },
    scrollWrapper: {
      overflow: "scroll",
      maxHeight: 600
    },
    selected: {
      borderLeft: `4px solid ${theme.palette.saleor.active[1]}`
    },
    supportHeader: {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "160%",
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    },
    showCheckboxShadows: {
      overflow: "visible"
    }
  }),
  { name: "TaxChannelsPage" }
);

export const TaxChannelsPage: React.FC<TaxChannelsPageProps> = props => {
  const { data, channels, selectedChannelId, handleTabChange, onBack } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const navigate = useNavigator();

  const [radioTest, setRadioTest] = React.useState("test1");

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage({
          id: "lnQAos",
          defaultMessage: "Taxes",
          description: "header"
        })}
      />
      <PageTabs value="channels" onChange={handleTabChange}>
        <PageTab label={"Channels"} value="channels" />
        <PageTab label={"Countries"} value="countries" />
        <PageTab label={"Tax classes"} value="classes" />
      </PageTabs>
      <VerticalSpacer spacing={2} />
      <Grid variant="inverted">
        <Card>
          <div className={classes.scrollWrapper}>
            <List gridTemplate={["1fr"]}>
              <ListHeader>
                <ListItem>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.channelList} />
                  </ListItemCell>
                </ListItem>
              </ListHeader>
              {channels?.map(channel => (
                <ListItem
                  key={channel.id}
                  className={clsx(classes.clickable, {
                    [classes.selected]: channel.id === selectedChannelId
                  })}
                  onClick={() => navigate(channelsListUrl(channel.id))}
                >
                  <ListItemCell>{channel.name}</ListItemCell>
                </ListItem>
              )) ?? <Skeleton />}
            </List>
          </div>
        </Card>
        <div>
          <Card>
            <CardTitle
              title={intl.formatMessage(taxesMessages.defaultSettings)}
            />
            <CardContent>
              <Typography className={classes.supportHeader}>
                <FormattedMessage {...taxesMessages.taxCharging} />
              </Typography>
              <FormControlLabel
                control={<Checkbox />}
                label={intl.formatMessage(taxesMessages.chargeTaxes)}
              />
            </CardContent>
            <Divider />
            <CardContent>
              <Grid variant="uniform">
                <RadioGroup
                  value={radioTest}
                  onChange={e => setRadioTest(e.target.value)}
                >
                  <Typography className={classes.supportHeader}>
                    <FormattedMessage {...taxesMessages.enteredPrices} />
                  </Typography>
                  <FormControlLabel
                    control={<Radio />}
                    label={intl.formatMessage(taxesMessages.pricesWithTaxLabel)}
                    value="test1"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label={intl.formatMessage(
                      taxesMessages.pricesWithoutTaxLabel
                    )}
                    value="test2"
                  />
                </RadioGroup>
                <div>
                  <Typography className={classes.supportHeader}>
                    <FormattedMessage {...taxesMessages.renderedPrices} />
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={intl.formatMessage(taxesMessages.showGrossHeader)}
                  />
                </div>
              </Grid>
            </CardContent>
          </Card>
          <VerticalSpacer spacing={3} />
          <Card>
            <CardTitle
              title={intl.formatMessage(taxesMessages.countryExceptions)}
              toolbar={
                <Button variant="secondary">
                  <FormattedMessage {...taxesMessages.addCountryLabel} />
                </Button>
              }
            />
            <List gridTemplate={["4fr 3fr 3fr 1fr"]}>
              <ListHeader>
                <ListItem>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.countryNameHeader} />
                  </ListItemCell>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.chargeTaxesHeader} />
                  </ListItemCell>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.showGrossHeader} />
                  </ListItemCell>
                </ListItem>
              </ListHeader>
              {data.map(el => (
                <ListItem key={el.id} hover={false}>
                  <ListItemCell>{el.name}</ListItemCell>
                  <ListItemCell>
                    <Checkbox />
                  </ListItemCell>
                  <ListItemCell>
                    <Checkbox />
                  </ListItemCell>
                  <ListItemCell>
                    <IconButton variant="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemCell>
                </ListItem>
              ))}
            </List>
          </Card>
        </div>
      </Grid>
    </Container>
  );
};
export default TaxChannelsPage;
