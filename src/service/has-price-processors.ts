import processorsRegistry from './processors-registry';

const hasPriceProcessors = () => {
  return processorsRegistry.length > 0;
};

export default hasPriceProcessors;
