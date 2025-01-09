/**
 * This is a registry of all the processors that will be used to process the pricing rules.
 * You can add your own processors by using Catalyst Pluginizr
 *
 * See the documentation for more information on how to create a processor or check ./processors/test-prices-processor.ts
 */
import { PricesProcessor } from '../types';

// import testPricesProcessor from './processors/test-prices-processor';
// const processorsRegistry: PricesProcessor[] = [testPricesProcessor];

const processorsRegistry: PricesProcessor[] = [];

export default processorsRegistry;
