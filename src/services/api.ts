//@ts-ignore
import axios from 'axios';
//@ts-ignore
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
  return config;
  //@ts-ignore
}, (error) => {
  return Promise.reject(error);
});

interface SearchParams {
  page: number;
  size?: number;
  keyword?: string;
  chain?: string;
}

interface SearchResponse {
  data: CoinData[];
  total: number;
  page: number;
}

export const searchCoins = async (params: SearchParams): Promise<SearchResponse> => {
  const { page, size = 100, keyword = '', chain = '' } = params;

  try {
    const response = await axios.post(
      'https://superwallet-markets-stg.coin98.dev/api/coin/search/admx',
      {
        page,
        size,
        keyword,
        chain: chain === 'all' ? '' : chain
      }
    );

    return response.data as SearchResponse;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};
