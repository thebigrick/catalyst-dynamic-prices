import { auth } from '@bigcommerce/catalyst-core/auth';

import { PricesProcessorContext } from '../types';

const getPricesProcessorContext = async (): Promise<PricesProcessorContext> => {
  const session = await auth();

  return {
    storeHash: process.env.BIGCOMMERCE_STORE_HASH ?? '',
    userEmail: session?.user?.email ?? null,
  };
};

export default getPricesProcessorContext;
