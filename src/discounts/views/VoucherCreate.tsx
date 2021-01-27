import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { decimal, joinDateTime, maybe } from "../../misc";
import {
  DiscountValueTypeEnum,
  VoucherTypeEnum
} from "../../types/globalTypes";
import VoucherCreatePage from "../components/VoucherCreatePage";
import { TypedVoucherCreate } from "../mutations";
import { RequirementsPicker } from "../types";
import { VoucherCreate } from "../types/VoucherCreate";
import { voucherListUrl, voucherUrl } from "../urls";

export const VoucherDetails: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const handleVoucherCreate = (data: VoucherCreate) => {
    if (data.voucherCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Successfully created voucher"
        })
      });
      navigate(voucherUrl(data.voucherCreate.voucher.id), true);
    }
  };

  return (
    <TypedVoucherCreate onCompleted={handleVoucherCreate}>
      {(voucherCreate, voucherCreateOpts) => (
        <>
          <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
          <VoucherCreatePage
            defaultCurrency={maybe(() => shop.defaultCurrency)}
            disabled={voucherCreateOpts.loading}
            errors={voucherCreateOpts.data?.voucherCreate.errors || []}
            onBack={() => navigate(voucherListUrl())}
            onSubmit={formData =>
              voucherCreate({
                variables: {
                  input: {
                    applyOncePerCustomer: formData.applyOncePerCustomer,
                    applyOncePerOrder: formData.applyOncePerOrder,
                    code: formData.code,
                    discountValue:
                      formData.discountType.toString() === "SHIPPING"
                        ? 100
                        : decimal(formData.value),
                    discountValueType:
                      formData.discountType.toString() === "SHIPPING"
                        ? DiscountValueTypeEnum.PERCENTAGE
                        : formData.discountType,
                    endDate: formData.hasEndDate
                      ? joinDateTime(formData.endDate, formData.endTime)
                      : null,
                    minAmountSpent:
                      formData.requirementsPicker !== RequirementsPicker.ORDER
                        ? 0
                        : parseFloat(formData.minSpent),
                    minCheckoutItemsQuantity:
                      formData.requirementsPicker !== RequirementsPicker.ITEM
                        ? 0
                        : parseFloat(formData.minCheckoutItemsQuantity),
                    startDate: joinDateTime(
                      formData.startDate,
                      formData.startTime
                    ),
                    type:
                      formData.discountType.toString() === "SHIPPING"
                        ? VoucherTypeEnum.ENTIRE_ORDER
                        : formData.type,
                    usageLimit: formData.hasUsageLimit
                      ? parseInt(formData.usageLimit, 10)
                      : null
                  }
                }
              })
            }
            saveButtonBarState={voucherCreateOpts.status}
          />
        </>
      )}
    </TypedVoucherCreate>
  );
};
export default VoucherDetails;
