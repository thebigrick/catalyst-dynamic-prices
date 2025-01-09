import collectPricesFromObject from './collect-prices-from-object';
import getPricesProcessorContext from './get-prices-processor-context';
import pricesProcessor from './prices-processor';

const transformPrices = async <TData extends object = object>(data: TData): Promise<TData> => {
  const { pointers, requests } = await collectPricesFromObject(data);

  if (Object.keys(pointers).length) {
    const context = await getPricesProcessorContext();

    const prices = await pricesProcessor(requests, context);

    // eslint-disable-next-line no-restricted-syntax
    for (const [requestId, processorResponse] of Object.entries(prices)) {
      if (pointers.hasOwnProperty(requestId)) {
        pointers[requestId].prices = {
          ...pointers[requestId].prices,
          ...processorResponse,
        };
      }
    }
  }

  return data;
};

export default transformPrices;
