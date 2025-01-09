import { Prices } from '../../types';
import adminApiRequest from '../admin-api-request';

import { CartItem } from './get-cart';

const updateCartLineItem = async (
  cartId: string,
  item: CartItem,
  newPrice: Prices | undefined,
  cartVersion: number,
): Promise<void> => {
  if (!newPrice) {
    return;
  }

  await adminApiRequest(`carts/${cartId}/items/${item.id}`, 'PUT', {
    line_item: {
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      list_price: newPrice.price?.value || 0,
    },
    version: cartVersion,
  });
};

export default updateCartLineItem;
