import { client } from '@bigcommerce/catalyst-core/client';
import { valuePlugin } from '@thebigrick/catalyst-pluginizr';

import addSkuToDocument from '../service/add-sku-to-document';
import transformPrices from '../service/transform-prices';

export default valuePlugin<typeof client>({
  resourceId: '@bigcommerce/catalyst-core/client:client',
  name: 'inject-prices',
  wrap: (c) => {
    const originalFetch = c.fetch.bind(c);

    c.fetch = async (...config: Parameters<typeof c.fetch>) => {
      // @ts-expect-error We have no types for this
      config[0].document = addSkuToDocument(config[0].document);

      const res = await originalFetch.call(this, ...config);

      return transformPrices<typeof res>(res);
    };

    return c;
  },
});
