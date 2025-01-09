import { PricesProcessorRequest, PricesProcessorRequestCollection } from '../../types';

import { CartData, CartItem } from './get-cart';

const convertCartItemToRequest = (
  items: CartItem[],
  currencyCode: string,
): PricesProcessorRequestCollection => {
  return items.reduce<PricesProcessorRequestCollection>((acc, item) => {
    const res: PricesProcessorRequest = {
      productId: item.product_id,
      variantId: item.variant_id,
      sku: item.sku,
      quantity: item.quantity,
      currencyCode,
    };

    return {
      ...acc,
      [item.id]: res,
    };
  }, {});
};

const getRequestsByCart = (data: CartData): PricesProcessorRequestCollection => {
  const currencyCode = data.currency.code;

  const physicalItems = convertCartItemToRequest(data.line_items.physical_items, currencyCode);
  const digitalItems = convertCartItemToRequest(data.line_items.digital_items, currencyCode);

  return {
    ...physicalItems,
    ...digitalItems,
  };
};

export default getRequestsByCart;
