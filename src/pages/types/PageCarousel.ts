//@ts-ignore
import { PageErrorCode } from "@saleor/types/globalTypes";
import { PageDetails_page } from "./PageDetails";

export interface PageCarouselCreate_pageCarouselCreate_errors {
    __typename: "ProductError";
    code: PageErrorCode;
    field: string | null;
  }

export interface PageCarouselCreate_pageCarouselCreate {
  __typename: "PageCarouselCreate";
  errors: PageCarouselCreate_pageCarouselCreate_errors[];
  carousel: PageDetails_page | null;
}
export interface PageCarouselCreate {
    pageCarouselCreate: PageCarouselCreate_pageCarouselCreate | null;
}

export interface PageCarouselVariables {
    carousel: string;
    image?: any | null;
    alt?: string | null;
    carouselUrl?: string | null;
}
export interface PageCarouselDelete_pageCarouselDelete_errors {
  __typename: "ProductError";
  code: PageErrorCode;
  field: string | null;
}

export interface PageCarouselDelete_pageCarouselDelete_page_carousel {
  __typename: "PageCarousel";
  id: string;
}

export interface PageCarouselDelete_pageCarouselDelete_product {
  __typename: "Product";
  id: string;
  media: PageCarouselDelete_pageCarouselDelete_page_carousel[] | null;
}
export interface PageCarouselDelete_pageCarouselDelete {
  __typename: "PageCarouselDelete";
  errors: PageCarouselDelete_pageCarouselDelete_errors[];
  product: PageCarouselDelete_pageCarouselDelete_product | null;
}
export interface PageCarouselDelete {
  pageCarouselDelete: PageCarouselDelete_pageCarouselDelete | null;
}

export interface PageCarouselDeleteVariables {
  id: string;
}