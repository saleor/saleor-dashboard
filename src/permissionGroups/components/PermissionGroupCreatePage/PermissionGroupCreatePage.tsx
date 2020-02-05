import React from "react";

import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";

import PermissionGroupInfo from "../PermissionGroupInfo";

export interface PermissionGroupCreatePageProps {
  disabled: boolean;
  onBack: () => void;
}

export interface PermissionGroupCreatePageFormData {
  name: string;
}

const initialForm: PermissionGroupCreatePageFormData = {
  name: ""
};

const PermissionGroupCreatePage: React.FC<PermissionGroupCreatePageProps> = ({
  disabled
}) => (
  <Form initial={initialForm}>
    {({ data, change }) => (
      <Container>
        <PermissionGroupInfo
          data={data}
          onChange={change}
          disabled={disabled}
        />
      </Container>
    )}
  </Form>
);
PermissionGroupCreatePage.displayName = "PermissionGroupCreatePage";
export default PermissionGroupCreatePage;
