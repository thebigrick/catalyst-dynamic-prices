import { v4 as uuidv4 } from 'uuid';

import { Prices, PricesProcessorRequestCollection } from '../types';

interface NodeWithSku {
  prices?: Prices;
  sku: string;
  entityId: number;
  variantId: number;
}

const collectPricesFromObject = async (
  data: object,
): Promise<{
  requests: PricesProcessorRequestCollection;
  pointers: Record<string, { prices: Prices | undefined }>;
}> => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!data || typeof data !== 'object') {
    return { requests: {}, pointers: {} };
  }

  if (Array.isArray(data)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const resultsArray = await Promise.all(data.map((item) => collectPricesFromObject(item)));

    return resultsArray.reduce(
      (acc, { requests: r, pointers: p }) => {
        Object.assign(acc.requests, r);
        Object.assign(acc.pointers, p);

        return acc;
      },
      { requests: {}, pointers: {} },
    );
  }

  const requests: PricesProcessorRequestCollection = {};
  const pointers: Record<string, { prices: Prices | undefined }> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const value of Object.values(data)) {
    if (value && typeof value === 'object') {
      if ('prices' in value) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const node = value as NodeWithSku;

        if (node.prices) {
          const requestId = uuidv4();

          requests[requestId] = {
            sku: node.sku,
            quantity: 1,
            productId: node.entityId,
            variantId: node.variantId,
            currencyCode: node.prices.price?.currencyCode || 'USD',
          };

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          pointers[requestId] = value;
        }
      } else {
        const { requests: nestedRequests, pointers: nestedPointers } =
          // eslint-disable-next-line no-await-in-loop,@typescript-eslint/no-unsafe-argument
          await collectPricesFromObject(value);

        Object.assign(requests, nestedRequests);
        Object.assign(pointers, nestedPointers);
      }
    }
  }

  return { requests, pointers };
};

export default collectPricesFromObject;
