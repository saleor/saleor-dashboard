// @ts-nocheck


const new_order_ui = () => (<><p>Enable brand-new UI for the Order Details page.</p>
</>)

export const AVAILABLE_FLAGS = [{
  name: "new_order_ui",
  displayName: "New Order UI",
  component: new_order_ui,
  visible: false,
  content: {
    enabled: false,
    payload: "default",
  }
}] as const;
