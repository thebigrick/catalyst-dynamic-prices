import adminApiRequest from '../admin-api-request';

export interface CartItem {
  id: string;
  product_id: number;
  variant_id: number;
  sku: string;
  quantity: number;
  list_price: number;
  sale_price: number;
}

export interface CartData {
  currency: {
    code: string;
  };
  line_items: {
    physical_items: CartItem[];
    digital_items: CartItem[];
  };
  version: number;
}

const getCart = async (cartId: string): Promise<CartData> => {
  return adminApiRequest<CartData>(`carts/${cartId}`);
};

export default getCart;
