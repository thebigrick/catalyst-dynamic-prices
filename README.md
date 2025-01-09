# Catalyst Price Processor

A flexible price processing system for BigCommerce Catalyst framework that allows multiple processors to modify product prices sequentially using the Pluginizr system.

> **BETA Notice**: This package is currently in beta. While stable and functional, it may undergo changes before the final release.

## Table of Contents
- [Environment Variables](#environment-variables)
- [Overview](#overview)
   - [Use Cases](#use-cases)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
   - [Basic Concepts](#basic-concepts)
   - [Creating a Price Processor](#creating-a-price-processor)
   - [Registering Processors](#registering-processors)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Catalyst Price Processor provides a foundational framework for implementing dynamic pricing systems in your Catalyst-based BigCommerce store. This system is designed to be a base upon which you can build your own pricing logic, whether it's:

- Integration with external pricing engines via API
- Implementation of complex business rules
- Real-time price calculations based on customer data
- Connection to ERP systems for B2B pricing
- Integration with third-party price optimization services

Each processor can access and modify the prices set by previous processors, making it ideal for implementing complex pricing rules like:

- Customer-specific pricing
- Real-time pricing
- Inventory-based pricing
- Time-based promotions
- Currency conversion
- Volume discounts
- Dynamic pricing based on external data
- And more...

## Use Cases

This framework can be used as a foundation for various pricing implementations:

1. **External Pricing Engine Integration**
   - Connect to your company's central pricing system
   - Make API calls to retrieve real-time prices
   - Implement caching strategies for better performance

2. **B2B Pricing Solutions**
   - Customer-specific pricing rules
   - Volume-based discounts
   - Contract-based pricing
   - Integration with ERP systems

3. **Dynamic Price Optimization**
   - A/B testing different pricing strategies
   - Time-based pricing adjustments
   - Demand-based pricing
   - Competitive price monitoring and adjustment

## Prerequisites

This package requires:
- A working [Catalyst](https://www.catalyst.dev/) project
- [Catalyst Pluginizr](https://github.com/thebigrick/catalyst-pluginizr) installed in your project

## Installation

Clone this repository into your Catalyst project's `plugins` directory:

```bash
cd /path-to-catalyst
git submodule add https://github.com/thebigrick/catalyst-dynamic-prices plugins/catalyst-dynamic-prices
```

**After installation, make sure to configure your environment variables as described in the next section.**

## Environment Variables

⚠️ **REQUIRED CONFIGURATION**: You need to set up the following environment variable in your `.env.local` file:

```bash
BIGCOMMERCE_ACCESS_TOKEN=your_token_here
```

This token must be generated from your BigCommerce backend and requires both read and write permissions for carts.

You can generate it from your BigCommerce control panel under Settings > API Access.

## Usage

### Basic Concepts

The price processor system works with requests and responses:

1. **Requests**: Each request contains:
   - Product information (SKU, quantity, productId, variantId)
   - Currency code
   - Each request is identified by a unique requestId in the collection
   - User information provided in the context object

2. **Responses**: Each processor returns a collection of responses that match the request IDs and contain:
   - Modified price information (price, basePrice, retailPrice, salePrice)
   - Optional price ranges (min/max values)

### Creating a Price Processor

Here's an example of a basic price processor:

```typescript
import { PricesProcessor, PricesProcessorResponseCollection } from '@thebigrick/catalyst-dynamic-prices';

const myPriceProcessor: PricesProcessor = async (requestsCollection, context) => {
  const output: PricesProcessorResponseCollection = {};

  for (const [requestId, request] of Object.entries(requestsCollection)) {
      if (context.userEmail === 'test@test.com') { // Apply only to a specific user
          output[requestId] = {
              price: {
                  value: calculateNewPrice(request), // Your price calculation logic
                  currencyCode: request.currencyCode,
              }
          };
      }
  }

  return output;
};

export default myPriceProcessor;
```

### Registering Processors

Register your processor using Catalyst Pluginizr. Create a new plugin file:

```typescript
import { valuePlugin } from '@thebigrick/catalyst-pluginizr';
import myPriceProcessor from './my-price-processor';

export default valuePlugin({
  name: 'add-my-price-processor',
  resourceId: '@thebigrick/catalyst-dynamic-prices/registry/processors-registry',
  wrap: (source) => [...source, myPriceProcessor],
});
```

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
