// @ts-strict-ignore
import {
  ChannelData,
  ChannelPriceAndPreorderArgs,
  ChannelPriceArgs,
} from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import PriceField from "@dashboard/components/PriceField";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ProductChannelListingErrorFragment, ProductErrorFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { getFormChannelError, getFormChannelErrors, getFormErrors } from "@dashboard/utils/errors";
import getProductErrorMessage from "@dashboard/utils/errors/product";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { sprinkles, Text, vars } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

interface ProductVariantPriceProps {
  productVariantChannelListings?: ChannelData[];
  errors: Array<ProductErrorFragment | ProductChannelListingErrorFragment>;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (id: string, data: ChannelPriceArgs | ChannelPriceAndPreorderArgs) => void;
  disabledMessage?: MessageDescriptor;
}

const numberOfColumns = 2;

export const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const {
    disabled = false,
    errors = [],
    productVariantChannelListings = [],
    loading,
    onChange,
    disabledMessage,
  } = props;
  const intl = useIntl();
  const channelErrors = errors.filter(e => "channels" in e) as ProductChannelListingErrorFragment[];
  const apiErrors = getFormChannelErrors(["price", "costPrice"], channelErrors);

  if (disabled || !productVariantChannelListings.length) {
    return (
      <DashboardCard>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "Xm9qOu",
            defaultMessage: "Pricing",
            description: "product pricing, section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Content>
          <Text size={2}>
            {intl.formatMessage(
              disabledMessage || {
                id: "e48Igh",
                defaultMessage:
                  "Assign this variant to a channel in the product channel manager to define prices",
                description: "variant pricing section subtitle",
              },
            )}
          </Text>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage({
          id: "Xm9qOu",
          defaultMessage: "Pricing",
          description: "product pricing, section header",
        })}
      </DashboardCard.Title>
      <ResponsiveTable>
        <TableHead>
          <TableRowLink>
            <TableCell style={{ paddingLeft: vars.spacing[6] }}>
              <Text size={2} color="default2">
                <FormattedMessage
                  id="c8UT0c"
                  defaultMessage="Channel Name"
                  description="tabel column header"
                />
              </Text>
            </TableCell>
            <TableCell style={{ width: 200, verticalAlign: "middle" }}>
              <Text size={2} color="default2">
                <FormattedMessage
                  id="JFtFgc"
                  defaultMessage="Selling Price"
                  description="tabel column header"
                />
              </Text>
            </TableCell>
            <TableCell style={{ width: 200, verticalAlign: "middle" }}>
              <Text size={2} color="default2">
                <FormattedMessage
                  id="2zCmiR"
                  defaultMessage="Cost price"
                  description="tabel column header"
                />
              </Text>
            </TableCell>
          </TableRowLink>
        </TableHead>
        <TableBody>
          {renderCollection(
            productVariantChannelListings,
            (listing, index) => {
              const fieldName = `${listing.id}-channel-price`;
              const formErrors = getFormErrors([fieldName], errors);
              const priceError =
                getFormChannelError(apiErrors.price, listing.id) || formErrors[fieldName];
              const costPriceError = getFormChannelError(apiErrors.costPrice, listing.id);

              return (
                <TableRowLink key={listing?.id || `skeleton-${index}`} data-test-id={listing?.name}>
                  <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                    <Text>{listing?.name || <Skeleton />}</Text>
                  </TableCell>
                  <TableCell>
                    {listing ? (
                      <PriceField
                        className={sprinkles({
                          marginY: 2,
                        })}
                        error={!!priceError}
                        name={fieldName}
                        value={listing.price || ""}
                        currencySymbol={listing.currency}
                        onChange={e =>
                          onChange(listing.id, {
                            costPrice: listing.costPrice,
                            price: e.target.value,
                            preorderThreshold: listing.preorderThreshold,
                          })
                        }
                        disabled={loading}
                        required
                        hint={priceError && getProductErrorMessage(priceError, intl)}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell>
                    {listing ? (
                      <PriceField
                        className={sprinkles({
                          marginY: 2,
                        })}
                        error={!!costPriceError}
                        name={`${listing.id}-channel-costPrice`}
                        value={listing.costPrice || ""}
                        currencySymbol={listing.currency}
                        onChange={e =>
                          onChange(listing.id, {
                            costPrice: e.target.value,
                            price: listing.price,
                            preorderThreshold: listing.preorderThreshold,
                          })
                        }
                        disabled={loading}
                        hint={costPriceError ? getProductErrorMessage(costPriceError, intl) : ""}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <Text>
                    <FormattedMessage id="/glQgs" defaultMessage="No channels found" />
                  </Text>
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </DashboardCard>
  );
};
