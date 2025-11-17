export const productPoc323 = `query ProductVariants {
    productVariants(channel: "default-channel", first: 1 ) {
        edges {
            node {
                id
                breakingField
                
            }
        }
    }
}`;
