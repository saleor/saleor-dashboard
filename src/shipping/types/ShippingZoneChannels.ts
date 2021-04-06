/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShippingZoneChannels
// ====================================================

export interface ShippingZoneChannels_shippingZone_channels {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZoneChannels_shippingZone {
  __typename: "ShippingZone";
  id: string;
  channels: ShippingZoneChannels_shippingZone_channels[];
}

export interface ShippingZoneChannels {
  shippingZone: ShippingZoneChannels_shippingZone | null;
}

export interface ShippingZoneChannelsVariables {
  id: string;
}
