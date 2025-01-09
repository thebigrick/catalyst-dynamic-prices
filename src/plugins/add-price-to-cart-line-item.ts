import { addCartLineItem } from '@bigcommerce/catalyst-core/client/mutations/add-cart-line-item';
import { functionPlugin } from '@thebigrick/catalyst-pluginizr';

import applyCartPrices from '../service/apply-cart-prices';
import hasPriceProcessors from '../service/has-price-processors';

export default functionPlugin<typeof addCartLineItem>({
  resourceId: '@bigcommerce/catalyst-core/client/mutations/add-cart-line-item:addCartLineItem',
  name: 'add-price-to-cart-line-item',
  wrap: async (addCartLineItemSource, cartEntityId, data) => {
    const res = await addCartLineItemSource(cartEntityId, data);

    if (hasPriceProcessors()) {
      // eslint-disable-next-line
      const cartId = (res.data as any)?.cart?.addCartLineItems?.cart.entityId as string;

      await applyCartPrices(cartId);
    }

    return res;
  },
});
