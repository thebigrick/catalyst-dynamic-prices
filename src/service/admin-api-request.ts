const adminApiRequest = async <TData = object>(
  endpoint: string,
  method = 'GET',
  body?: object,
): Promise<TData> => {
  const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;

  if (!accessToken) {
    throw new Error('BIGCOMMERCE_ACCESS_TOKEN is not provided');
  }

  const url = `https://api.bigcommerce.com/stores/${storeHash}/v3/${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      'X-Auth-Token': accessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorData = await response.json();

    console.error(`Error with ${method} request to ${endpoint}:`, errorData);
    throw new Error(`Failed ${method} request to ${endpoint}.`);
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const res = (await response.json()) as { data: TData };

  return res.data;
};

export default adminApiRequest;
