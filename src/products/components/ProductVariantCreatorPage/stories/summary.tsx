export default {
  title: "Views / Products / Create multiple variants / summary",
  decorators: [storyFn => <Container>{storyFn()}</Container>, Decorator]
};

export const Default = () => (
  <ProductVariantCreatorContent
    {...props}
    step={ProductVariantCreatorStep.summary}
  />
);

Default.story = {
  name: "default"
};

export const Errors = () => (
  <ProductVariantCreatorContent
    {...props}
    step={ProductVariantCreatorStep.summary}
    errors={errors}
  />
);

Errors.story = {
  name: "errors"
};
