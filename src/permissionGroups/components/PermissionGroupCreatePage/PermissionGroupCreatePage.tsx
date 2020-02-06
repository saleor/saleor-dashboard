import React from "react";
import { useIntl } from "react-intl";

import Container from "@saleor/components/Container";
import AccountPermissions from "@saleor/components/AccountPermissions";
import Grid from "@saleor/components/Grid";
import Form from "@saleor/components/Form";
import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import { PermissionEnum } from "@saleor/types/globalTypes";

import PermissionGroupInfo from "../PermissionGroupInfo";

export interface PermissionGroupCreatePageProps {
  disabled: boolean;
  permissions: ShopInfo_shop_permissions[];
  onBack: () => void;
}

export interface PermissionGroupCreatePageFormData {
  name: string;
  hasFullAccess: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
}

const initialForm: PermissionGroupCreatePageFormData = {
  hasFullAccess: false,
  isActive: false,
  name: "",
  permissions: []
};

const PermissionGroupCreatePage: React.FC<PermissionGroupCreatePageProps> = ({
  disabled,
  permissions
}) => {
  const intl = useIntl();

  return (
    <Form initial={initialForm}>
      {({ data, change }) => (
        <Container>
          <Grid>
            <div>
              <PermissionGroupInfo
                data={data}
                onChange={change}
                disabled={disabled}
              />
            </div>
            <div>
              <AccountPermissions
                data={data}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
                fullAccessLabel={intl.formatMessage({
                  defaultMessage: "Group has full access to the store",
                  description: "checkbox label"
                })}
                description={intl.formatMessage({
                  defaultMessage:
                    "Expand or restrict group's permissions to access certain part of saleor system.",
                  description: "card description"
                })}
              />
            </div>
          </Grid>
        </Container>
      )}
    </Form>
  );
};
PermissionGroupCreatePage.displayName = "PermissionGroupCreatePage";
export default PermissionGroupCreatePage;
