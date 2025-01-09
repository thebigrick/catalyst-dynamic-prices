import { PricesProcessorResponseCollection } from '../types';

import getCart, { CartItem } from './cart/get-cart';
import getRequestsByCart from './cart/get-requests-by-cart';
import updateCartLineItem from './cart/update-cart-line-item';
import getPricesProcessorContext from './get-prices-processor-context';
import pricesProcessor from './prices-processor';

const filterItemsToUpdate = (items: CartItem[], res: PricesProcessorResponseCollection) => {
  return items.filter((item) => {
    const prices = res[item.id];

    if (!prices) {
      return false;
    }

    return item.list_price !== prices.price?.value;
  });
};

const applyCartPrices = async (cartId: string): Promise<void> => {
  const cart = await getCart(cartId);

  const context = await getPricesProcessorContext();
  const requests = getRequestsByCart(cart);
  const res = await pricesProcessor(requests, context);

  const {
    line_items: { physical_items: physicalItems, digital_items: digitalItems },
  } = cart;

  // Get the cart line ids where the prices differ from the ones given by the prices processor
  const physicalItemsToUpdate = filterItemsToUpdate(physicalItems, res);
  const digitalItemsToUpdate = filterItemsToUpdate(digitalItems, res);

  // eslint-disable-next-line no-restricted-syntax
  for (const item of [...physicalItemsToUpdate, ...digitalItemsToUpdate]) {
    // eslint-disable-next-line no-await-in-loop
    await updateCartLineItem(cartId, item, res[item.id], cart.version);
  }
};

export default applyCartPrices;
