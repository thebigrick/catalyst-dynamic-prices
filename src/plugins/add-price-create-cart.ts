import { createCart } from '@bigcommerce/catalyst-core/client/mutations/create-cart';
import { functionPlugin } from '@thebigrick/catalyst-pluginizr';

import applyCartPrices from '../service/apply-cart-prices';

export default functionPlugin<typeof createCart>({
  resourceId: '@bigcommerce/catalyst-core/client/mutations/create-cart:createCart',
  name: 'add-price-to-create-cart',
  wrap: async (createCartSource, data) => {
    const res = await createCartSource(data);

    // eslint-disable-next-line
    const cartId = (res.data as any)?.cart?.createCart?.cart.entityId as string;

    await applyCartPrices(cartId);

    return res;
  },
});
