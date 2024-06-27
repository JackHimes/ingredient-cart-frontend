import axios from 'axios';

export const fetchProducts = async (queryParams: any) => {
  try {
    const response = await axios.get('/api/products', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getItemsUpcs = async (items: string[], token: string): Promise<any> => {
    try {
      const response = await axios.post('http://localhost:3333/api/products/getItemsUpcs', { items }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  };