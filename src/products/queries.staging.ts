export const productPoc323 = `query ProductVariantsStaging {
    productVariants(channel: "default-channel", first: 1 ) {
        edges {
            node {
                id
                breakingField
                
            }
        }
    }
}`;
