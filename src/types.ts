export type PricesProcessorRequestCollection = Record<string, PricesProcessorRequest>;
export type PricesProcessorResponseCollection = Record<string, PricesProcessorResponse>;

export interface PricesProcessorContext {
  userEmail: string | null;
  storeHash: string;
}

export interface PricesProcessorRequest {
  sku?: string;
  quantity: number;
  productId: number;
  variantId: number;
  currencyCode: string;
}

export type PricesProcessorResponse = Prices | undefined;

export type PricesProcessor = (
  requestsCollection: PricesProcessorRequestCollection,
  context: PricesProcessorContext,
) => Promise<PricesProcessorResponseCollection>;

export interface PriceItem {
  value: number;
  currencyCode: string;
}

export interface Prices {
  price?: PriceItem;
  basePrice?: PriceItem;
  retailPrice?: PriceItem;
  salePrice?: PriceItem;
  priceRange?: {
    min?: PriceItem;
    max?: PriceItem;
  };
}
