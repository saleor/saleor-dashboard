import React from "react";
import { useIntl } from "react-intl";

import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { maybe } from "../../../misc";
import { ShippingMethodTypeEnum } from "../../../types/globalTypes";
import ShippingZoneDetailsPage from "../../components/ShippingZoneDetailsPage";
import { TypedShippingZone } from "../../queries";
import { CreateShippingRate } from "../../types/CreateShippingRate";
import { DeleteShippingRate } from "../../types/DeleteShippingRate";
import { DeleteShippingZone } from "../../types/DeleteShippingZone";
import { UpdateShippingRate } from "../../types/UpdateShippingRate";
import { UpdateShippingZone } from "../../types/UpdateShippingZone";
import {
  shippingZonesListUrl,
  shippingZoneUrl,
  ShippingZoneUrlQueryParams
} from "../../urls";
import ShippingZoneDetailsDialogs from "./ShippingZoneDetailsDialogs";
import ShippingZoneOperations from "./ShippingZoneOperations";

export interface ShippingZoneDetailsProps {
  id: string;
  params: ShippingZoneUrlQueryParams;
}

const ShippingZoneDetails: React.FC<ShippingZoneDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const closeModal = () => navigate(shippingZoneUrl(id), true);

  const onShippingRateCreate = (data: CreateShippingRate) => {
    if (data.shippingPriceCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      closeModal();
    }
  };

  const onShippingRateUpdate = (data: UpdateShippingRate) => {
    if (data.shippingPriceUpdate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      closeModal();
    }
  };

  const onShippingRateDelete = (data: DeleteShippingRate) => {
    if (data.shippingPriceDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      closeModal();
    }
  };

  const onShippingZoneDelete = (data: DeleteShippingZone) => {
    if (data.shippingZoneDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(shippingZonesListUrl(), true);
    }
  };

  const onShippingZoneUpdate = (data: UpdateShippingZone) => {
    if (data.shippingZoneUpdate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      closeModal();
    }
  };

  return (
    <ShippingZoneOperations
      onShippingRateCreate={onShippingRateCreate}
      onShippingRateDelete={onShippingRateDelete}
      onShippingRateUpdate={onShippingRateUpdate}
      onShippingZoneDelete={onShippingZoneDelete}
      onShippingZoneUpdate={onShippingZoneUpdate}
    >
      {ops => (
        <TypedShippingZone variables={{ id }}>
          {({ data, loading }) => (
            <>
              <ShippingZoneDetailsPage
                disabled={loading}
                errors={
                  ops.shippingZoneUpdate.opts.data?.shippingZoneUpdate.errors ||
                  []
                }
                onBack={() => navigate(shippingZonesListUrl())}
                onCountryAdd={() =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "assign-country"
                    })
                  )
                }
                onCountryRemove={code =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "unassign-country",
                      id: code
                    })
                  )
                }
                onDelete={() =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "remove"
                    })
                  )
                }
                onPriceRateAdd={() =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "add-rate",
                      type: ShippingMethodTypeEnum.PRICE
                    })
                  )
                }
                onPriceRateEdit={rateId =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "edit-rate",
                      id: rateId
                    })
                  )
                }
                onRateRemove={rateId =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "remove-rate",
                      id: rateId
                    })
                  )
                }
                onSubmit={formData =>
                  ops.shippingZoneUpdate.mutate({
                    id,
                    input: {
                      name: formData.name
                    }
                  })
                }
                onWeightRateAdd={() =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "add-rate",
                      type: ShippingMethodTypeEnum.WEIGHT
                    })
                  )
                }
                onWeightRateEdit={rateId =>
                  navigate(
                    shippingZoneUrl(id, {
                      action: "edit-rate",
                      id: rateId
                    })
                  )
                }
                saveButtonBarState={ops.shippingZoneUpdate.opts.status}
                shippingZone={maybe(() => data.shippingZone)}
              />
              <ShippingZoneDetailsDialogs
                assignCountryTransitionState={
                  ops.shippingZoneUpdate.opts.status
                }
                createRateTransitionState={ops.shippingRateCreate.opts.status}
                deleteRateTransitionState={ops.shippingRateDelete.opts.status}
                deleteZoneTransitionState={ops.shippingZoneDelete.opts.status}
                id={id}
                ops={ops}
                params={params}
                shippingZone={maybe(() => data.shippingZone)}
                unassignCountryTransitionState={
                  ops.shippingZoneUpdate.opts.status
                }
                updateRateTransitionState={ops.shippingRateUpdate.opts.status}
              />
            </>
          )}
        </TypedShippingZone>
      )}
    </ShippingZoneOperations>
  );
};
export default ShippingZoneDetails;
