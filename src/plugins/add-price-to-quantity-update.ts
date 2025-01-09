import { updateItemQuantity } from '@bigcommerce/catalyst-core/app/[locale]/(default)/cart/_components/item-quantity/update-item-quantity';
import { functionPlugin } from '@thebigrick/catalyst-pluginizr';

import applyCartPrices from '../service/apply-cart-prices';
import hasPriceProcessors from '../service/has-price-processors';

export default functionPlugin<typeof updateItemQuantity>({
  resourceId:
    '@bigcommerce/catalyst-core/app/[locale]/(default)/cart/_components/item-quantity/update-item-quantity:updateItemQuantity',
  name: 'add-price-to-quantity-update',
  wrap: async (updateItemQuantitySource, ...args) => {
    const res = await updateItemQuantitySource(...args);

    if (hasPriceProcessors() && res.status === 'success') {
      // eslint-disable-next-line
      const cartId = (res as any).data.entityId as string;

      await applyCartPrices(cartId);
    }

    return res;
  },
});
