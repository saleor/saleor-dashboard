import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { sectionNames } from "@saleor/intl";
import { decimal, joinDateTime, maybe } from "../../misc";
import { DiscountValueTypeEnum, SaleType } from "../../types/globalTypes";
import SaleCreatePage from "../components/SaleCreatePage";
import { TypedSaleCreate } from "../mutations";
import { SaleCreate } from "../types/SaleCreate";
import { saleListUrl, saleUrl } from "../urls";

function discountValueTypeEnum(type: SaleType): DiscountValueTypeEnum {
  return type.toString() === DiscountValueTypeEnum.FIXED
    ? DiscountValueTypeEnum.FIXED
    : DiscountValueTypeEnum.PERCENTAGE;
}

export const SaleDetails: React.FC = () => {
  const navigate = useNavigator();
  const pushMessage = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const handleSaleCreate = (data: SaleCreate) => {
    if (data.saleCreate.errors.length === 0) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Successfully created sale"
        })
      });
      navigate(saleUrl(data.saleCreate.sale.id), true);
    }
  };

  return (
    <TypedSaleCreate onCompleted={handleSaleCreate}>
      {(saleCreate, saleCreateOpts) => (
        <>
          <WindowTitle title={intl.formatMessage(sectionNames.sales)} />
          <SaleCreatePage
            defaultCurrency={maybe(() => shop.defaultCurrency)}
            disabled={saleCreateOpts.loading}
            errors={saleCreateOpts.data?.saleCreate.errors || []}
            onBack={() => navigate(saleListUrl())}
            onSubmit={formData =>
              saleCreate({
                variables: {
                  input: {
                    endDate: formData.hasEndDate
                      ? joinDateTime(formData.endDate, formData.endTime)
                      : null,
                    name: formData.name,
                    startDate: joinDateTime(
                      formData.startDate,
                      formData.startTime
                    ),
                    type: discountValueTypeEnum(formData.type),
                    value: decimal(formData.value)
                  }
                }
              })
            }
            saveButtonBarState={saleCreateOpts.status}
          />
        </>
      )}
    </TypedSaleCreate>
  );
};
export default SaleDetails;
