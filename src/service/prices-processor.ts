import {
  PricesProcessorContext,
  PricesProcessorRequestCollection,
  PricesProcessorResponseCollection,
} from '../types';

import processorsRegistry from './processors-registry';

/**
 * Processes the prices using the processors defined in the registry.
 * @param {PricesProcessorRequest[]} srcRequests
 * @param {PricesProcessorContext} context
 * @return {Promise<Prices[]>}
 */
const pricesProcessor = async (
  srcRequests: PricesProcessorRequestCollection,
  context: PricesProcessorContext,
): Promise<PricesProcessorResponseCollection> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const requests = JSON.parse(JSON.stringify(srcRequests)) as PricesProcessorRequestCollection;
  const output: PricesProcessorResponseCollection = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const processor of processorsRegistry) {
    // eslint-disable-next-line no-await-in-loop
    const processorResponses = await processor(requests, context);

    Object.entries(processorResponses).forEach(([requestId, processorResponse]) => {
      output[requestId] = processorResponse;
    });
  }

  return output;
};

export default pricesProcessor;
