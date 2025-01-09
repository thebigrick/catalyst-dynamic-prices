import { PricesProcessor, PricesProcessorResponseCollection } from '../../types';

/**
 * This is a test prices processor that sets the price to 75 USD for all the products.
 * Processors must respond with the same request ids they received and the prices they want to set.
 *
 * @param {PricesProcessorRequestCollection} requestsCollection
 * @param {PricesProcessorContext} context
 * @return {Promise<PricesProcessorResponseCollection>}
 */
const testPricesProcessor: PricesProcessor = async (requestsCollection, context) => {
  const output: PricesProcessorResponseCollection = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [requestId, request] of Object.entries(requestsCollection)) {
    output[requestId] = {
      price: {
        value: 75,
        currencyCode: request.currencyCode,
      },
    };
  }

  return output;
};

export default testPricesProcessor;
