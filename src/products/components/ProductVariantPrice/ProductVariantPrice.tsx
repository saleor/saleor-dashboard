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
import { ProductChannelListingErrorFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import {
  getFormChannelError,
  getFormChannelErrors,
} from "@dashboard/utils/errors";
import getProductErrorMessage from "@dashboard/utils/errors/product";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Text, vars } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

interface ProductVariantPriceProps {
  ProductVariantChannelListings?: ChannelData[];
  errors?: ProductChannelListingErrorFragment[];
  loading?: boolean;
  disabled?: boolean;
  onChange?: (
    id: string,
    data: ChannelPriceArgs | ChannelPriceAndPreorderArgs,
  ) => void;
  disabledMessage?: MessageDescriptor;
}

const numberOfColumns = 2;

export const ProductVariantPrice: React.FC<
  ProductVariantPriceProps
> = props => {
  const {
    disabled = false,
    errors = [],
    ProductVariantChannelListings = [],
    loading,
    onChange,
    disabledMessage,
  } = props;
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price", "costPrice"], errors);

  if (disabled || !ProductVariantChannelListings.length) {
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
          <Text variant="caption">
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
              <Text variant="caption" color="textNeutralSubdued">
                <FormattedMessage
                  id="c8UT0c"
                  defaultMessage="Channel Name"
                  description="tabel column header"
                />
              </Text>
            </TableCell>
            <TableCell style={{ width: 200, verticalAlign: "middle" }}>
              <Text variant="caption" color="textNeutralSubdued">
                <FormattedMessage
                  id="JFtFgc"
                  defaultMessage="Selling Price"
                  description="tabel column header"
                />
              </Text>
            </TableCell>
            <TableCell style={{ width: 200, verticalAlign: "middle" }}>
              <Text variant="caption" color="textNeutralSubdued">
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
            ProductVariantChannelListings,
            (listing, index) => {
              const priceError = getFormChannelError(
                formErrors.price,
                listing.id,
              );
              const costPriceError = getFormChannelError(
                formErrors.costPrice,
                listing.id,
              );

              return (
                <TableRowLink key={listing?.id || `skeleton-${index}`}>
                  <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                    <Text>{listing?.name || <Skeleton />}</Text>
                  </TableCell>
                  <TableCell>
                    {listing ? (
                      <PriceField
                        error={!!priceError}
                        label={intl.formatMessage({
                          id: "b1zuN9",
                          defaultMessage: "Price",
                        })}
                        name={`${listing.id}-channel-price`}
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
                        hint={
                          priceError && getProductErrorMessage(priceError, intl)
                        }
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell>
                    {listing ? (
                      <PriceField
                        error={!!costPriceError}
                        label={intl.formatMessage({
                          id: "KQSONM",
                          defaultMessage: "Cost",
                          description: "tabel column header",
                        })}
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
                        hint={
                          costPriceError
                            ? getProductErrorMessage(costPriceError, intl)
                            : ""
                        }
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
                    <FormattedMessage
                      id="/glQgs"
                      defaultMessage="No channels found"
                    />
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
